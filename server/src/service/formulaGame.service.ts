import { Op } from "sequelize";
import { carStateEnum as carStateE } from "../../../common/src/models/enums/formula";
import { gamesStateIdEnum as gamesStateIdE, gamesUsersReadyStateEnum as readyStateE } from "../../../common/src/models/enums/game";
import { foCars } from "../../../common/src/models/generated/foCars";
import { foCurves } from "../../../common/src/models/generated/foCurves";
import { foDamages, foDamagesAttributes } from "../../../common/src/models/generated/foDamages";
import { foEDamageTypes } from "../../../common/src/models/generated/foEDamageTypes";
import { foGames, foGamesAttributes } from "../../../common/src/models/generated/foGames";
import { foPosition2Positions } from "../../../common/src/models/generated/foPosition2Positions";
import { foPositions } from "../../../common/src/models/generated/foPositions";
import { foTracks } from "../../../common/src/models/generated/foTracks";
import { games, gamesAttributes } from "../../../common/src/models/generated/games";
import { gamesUsers } from "../../../common/src/models/generated/gamesUsers";
import { users, usersAttributes } from "../../../common/src/models/generated/users";
import { PreconditionRequiredError } from "../utils/errors";

const config = {
  maxCarsPerPlayer: 15,
};

const add = async ({
  user,
  name,
}: {
  user: usersAttributes;
  name: string | null;
}): Promise<number> => {
  const foTrackId = 1;
  const foTrack = await foTracks.findByPk(foTrackId);
  const game = games.build({
    name: name ?? `${user.name}'s ${foTrack.name}`,
    maxPlayers: 8,
    creatorId: user.id,
    gameTypeId: 2,
  });
  await game.save();
  await gamesUsers.build({ userId: user.id, gameId: game.id }).save();
  const foGame = await foGames
    .build({ gameId: game.id, foTrackId: foTrackId, carsPerPlayer: 2 })
    .save();
  for (let i = config.maxCarsPerPlayer; i > 0; i--) {
    await addCar({ userId: user.id, gameId: game.id });
  }
  try {
    return game.id;
  } catch (e) {
    throw e;
  }
};

const join = async ({ gameId, userId }: { gameId: number; userId: number }) => {
  try {
    await gamesUsers.findOrCreate({
      where: { gameId: gameId, userId: userId },
    });
    if (
      (await foCars.findOne({ where: { gameId: gameId, userId: userId } })) ==
      null
    ) {
      for (let i = config.maxCarsPerPlayer; i > 0; i--) {
        await addCar({ userId: userId, gameId: gameId });
      }
    }
    return gameId;
  } catch (e) {
    throw e;
  }
};

const addCar = async ({
  userId,
  gameId,
}: {
  userId: number;
  gameId: number;
}): Promise<foCars> => {
  const foCar = await foCars.build({ userId: userId, gameId: gameId }).save();
  await Promise.all(
    (
      await foEDamageTypes.findAll()
    ).map(async (foEDamageType) => {
      await foDamages
        .build({ foCarId: foCar.id, type: foEDamageType.id, wearPoints: 3 })
        .save();
    })
  );
  return foCar;
};

type gameSetup = foGamesAttributes & gamesAttributes;

const getGame = async ({
  gameId,
}: {
  gameId: number;
}): Promise<gameSetup> => {
  const game = await games.findByPk(gameId, {
    include: [
      { model: foGames, as: "foGame" },
      {
        model: gamesUsers,
        as: "gamesUsers",
        include: [{ model: users, as: "user", attributes: ["id", "name"] }],
      },
      {
        model: foCars,
        as: "foCars",
        include: [{ model: foDamages, as: "foDamages" }],
      },
    ],
  });
  const gameSetup = { ...game.toJSON(), ...game.foGame.toJSON() };
  // @ts-ignore
  delete gameSetup.foGame;
  return gameSetup;
};

const editGameSetup = async ({
  gameId,
  gameSetup,
}: {
  gameId: number;
  gameSetup: gameSetup;
}) => {
  const game = await games.findByPk(gameId, {
    include: { model: foGames, as: "foGame" },
  });
  for (const [property, value] of Object.entries(gameSetup)) {
    game[property] = value;
    game.foGame[property] = value;
  }
  await game.save();
  await game.foGame.save();

  await gamesUsers.update({ readyState: readyStateE.notReady }, { where: { gameId: gameId } });
};

const editCarSetup = async ({
  userId,
  gameId,
  foCarId,
  foCarDamages,
}: {
  userId: number;
  gameId: number;
  foCarId: number;
  foCarDamages: [foDamagesAttributes];
}) => {
  for (const foCarDamage of foCarDamages) {
    await foDamages.update(
      { wearPoints: Math.max(1, foCarDamage.wearPoints) },
      { where: { foCarId: foCarId, type: foCarDamage.type } }
    );
  }

  await setUserReady({ gameId: gameId, userId: userId, isReady: false });
};

const setUserReady = async ({
  gameId,
  userId,
  isReady,
}: {
  gameId: number;
  userId: number;
  isReady: boolean;
}) => {
  // first figure out if the user
  if (!isReady) {
    await gamesUsers.update(
      { readyState: readyStateE.notReady },
      { where: { gameId: gameId, userId: userId } }
    );
    return;
  } else {
    const game = await getGame({ gameId: gameId });

    // @ts-ignore
    const userFoCars: [foCars] = game.foCars;
    // all user's cars have to have the correct number of WP assigned
    const allCarsCorrectWearPoints = userFoCars
      .slice(0, game.carsPerPlayer)
      .filter((foCar) => foCar.userId === userId)
      .every(
        (foCar) =>
          foCar.foDamages.reduce((carry, next) => carry + next.wearPoints, 0) ==
          game.wearPoints
      );
    if (allCarsCorrectWearPoints) {
      await gamesUsers.update(
        { readyState: readyStateE.ready },
        { where: { gameId: gameId, userId: userId } }
      );
    }
    return;
  }
};

// @todo Consider use gameIdParam interface where relevant
const start = async ({ gameId }: gameIdParam) => {
  const game = await games.findByPk(gameId, {
    include: [
      { model: foGames, as: "foGame" },
      { model: gamesUsers, as: "gamesUsers" },
      { model: foCars, as: "foCars" },
    ],
  });

  const gameUsers: gamesUsers[] = game.gamesUsers;

  // First, all users must be ready to start
  if (gameUsers.every((gameUser) => gameUser.readyState == readyStateE.ready)) {
    // We set the game to started
    await games.update({ gameStateId: gamesStateIdE.started }, { where: { id: gameId } });

    // We need to remove each user's excess cars
    //const gameCars = await foCars.findAll({ where: { gameId: gameId } });
    await Promise.all(
      gameUsers.map(async (gameUser) => {
        await Promise.all(
          game.foCars
            .filter((gameCar) => gameCar.userId == gameUser.userId)
            .map(async (gameCar, userCarIndex) => {
              if (userCarIndex >= game.foGame.carsPerPlayer) {
                await gameCar.destroy();
              }
            })
        );
      })
    );

    game.foCars = await game.getFoCars();

    // @todo Setting up pitstops global and for cars - later; for now zero stops - see next line
    game.foCars.forEach(
      (foCar) => (foCar.techPitstopsLeft = game.foGame.techPitstops)
    );

    // Make car teams - if 2 per player, then each player has team, otherwise assign first two cars team 1, second 2 team 2, ...
    if (game.foGame.carsPerPlayer == 2) {
      // Each player will have cars in the same team
      gameUsers.forEach((gameUser, teamNumber) =>
        game.foCars
          .filter((car) => car.userId == gameUser.userId)
          .forEach((car) => (car.team = teamNumber + 1))
      );
    } else {
      // Players do not have two cars each, then cars are randomly assigned to teams
      let teamNumber = 1;
      const maxTeamNumber = 5;
      game.foCars.sort(() => Math.random() - 0.5);
      game.foCars.forEach((car) => {
        car.team = teamNumber;
        // Roll through the team numbers
        teamNumber = teamNumber == maxTeamNumber ? 1 : teamNumber + 1;
      });
    }

    // Assign starting positions in random order and each car in "RACING" state
    game.foCars.sort(() => Math.random() - 0.5);

    const startingPositions = await foPositions.findAll({
      where: {
        foTrackId: game.foGame.foTrackId,
        startingPosition: { [Op.not]: null },
      },
    });
    startingPositions.sort((a, b) => a.startingPosition - b.startingPosition);

    game.foCars.forEach((car, carIndex) => {
      car.foPositionId = startingPositions[carIndex].id;
      car.state = carStateE.racing;
      car.order = carIndex + 1;
    });

    game.foCars.forEach((car) => car.save());

    return game;
  } else {
    throw new PreconditionRequiredError("All players must be in ready state");
  }
};

interface gameIdParam {
  gameId: number;
}

interface foTrackIdParam {
  foTrackId: number;
}

const getTrack = async (
  params: (gameIdParam | foTrackIdParam) & {
    include?: { foPosition2Position?: Boolean };
  }
) => {
  let foTrackId;
  if ("foTrackId" in params) {
    foTrackId = params.foTrackId;
  } else {
    foTrackId = (
      await games.findByPk(params.gameId, {
        include: { model: foGames, as: "foGame" },
      })
    ).foGame.foTrackId;
  }

  return await foTracks.findByPk(foTrackId, {
    include: [
      {
        model: foPositions,
        as: "foPositions",
        ...(params?.include?.foPosition2Position
          ? {
              include: [
                {
                  model: foPosition2Positions,
                  as: "foPosition2Positions",
                },
              ],
            }
          : {}),
      },
      { model: foCurves, as: "foCurves" },
    ],
  });
};

export default {
  add,
  join,
  getGame,
  editGameSetup,
  editCarSetup,
  setUserReady,
  start,
  getTrack,
};
export { gameSetup };
