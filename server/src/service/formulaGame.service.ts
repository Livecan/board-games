import { Op } from "sequelize";
import { CarStateEnum as CarStateE } from "../../../common/src/models/enums/formula";
import {
  gamesStateIdEnum as gamesStateIdE,
  gamesUsersReadyStateEnum as readyStateE,
} from "../../../common/src/models/enums/game";
import {
  isCollision,
  isFastStart,
  isShocksDamage,
  isSlowStart,
  rollBlackDice,
  rollGearDice,
} from "../../../common/src/models/formula/dice";
import {
  foCars,
  foCarsAttributes,
} from "../../../common/src/models/generated/foCars";
import { foCurves } from "../../../common/src/models/generated/foCurves";
import { foDebris } from "../../../common/src/models/generated/foDebris";
import { foEDamageTypes } from "../../../common/src/models/generated/foEDamageTypes";
import {
  foGames,
  foGamesAttributes,
} from "../../../common/src/models/generated/foGames";
import { foPosition2Positions } from "../../../common/src/models/generated/foPosition2Positions";
import { foPositions } from "../../../common/src/models/generated/foPositions";
import { foTracks } from "../../../common/src/models/generated/foTracks";
import {
  games,
  gamesAttributes,
} from "../../../common/src/models/generated/games";
import { gamesUsers } from "../../../common/src/models/generated/gamesUsers";
import { foTurns } from "../../../common/src/models/generated/foTurns";
import {
  users,
  usersAttributes,
} from "../../../common/src/models/generated/users";
import {
  getMos,
  validateMo,
} from "../../../common/src/models/formula/moveOption";
import { InvalidValueError, PreconditionRequiredError } from "../utils/errors";
import { fullFormulaGame } from "../../../common/src/models/interfaces/formula";

interface gameIdParam {
  gameId: number;
}

interface gameAndUserIdParam extends gameIdParam {
  userId: number;
}

interface foTrackIdParam {
  foTrackId: number;
}

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

const join = async ({ gameId, userId }: gameAndUserIdParam) => {
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
}: gameAndUserIdParam): Promise<foCars> => {
  const foCar = await foCars
    .build({
      userId: userId,
      gameId: gameId,
      wpTire: 6,
      wpGearbox: 3,
      wpBrakes: 3,
      wpEngine: 3,
      wpChassis: 3,
      wpShocks: 3,
    })
    .save();
  return foCar;
};

// @todo See fullGame interface and consider using here!
type gameSetup = foGamesAttributes & gamesAttributes;

const getGame = async ({ gameId }: gameIdParam): Promise<fullFormulaGame> => {
  const foGame = await foGames.findByPk(gameId, {
    include: [
      {
        model: games,
        as: "game",
        include: [
          {
            model: gamesUsers,
            as: "gamesUsers",
            include: [{ model: users, as: "user", attributes: ["id", "name"] }],
          },
        ],
      },
      {
        model: foCars,
        as: "foCars",
      },
      {
        model: foDebris,
        as: "foDebris",
      },
      {
        model: foTurns,
        as: "foTurns",
        // @todo I do not want INNER JOIN here
        required: false,
        where: {
          [Op.or]: [{ gear: null }, { foPositionId: null }],
        },
      },
    ],
  });

  const gameSetup = {
    ...foGame.toJSON(),
    ...foGame.game.toJSON(),
    lastTurn: foGame.foTurns.pop(),
    foTurns: null,
  } as fullFormulaGame;

  // @ts-ignore
  delete gameSetup.foGame;
  return gameSetup;
};

const editGameSetup = async ({
  gameId,
  gameSetup,
}: gameIdParam & {
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

  await gamesUsers.update(
    { readyState: readyStateE.notReady },
    { where: { gameId: gameId } }
  );
};

const editCarSetup = async ({
  userId,
  gameId,
  foCarId,
  foCar,
}: gameAndUserIdParam & {
  foCarId: number;
  foCar: foCarsAttributes;
}) => {
  await foCars.update(foCar, { where: { id: foCarId } });

  await setUserReady({ gameId: gameId, userId: userId, isReady: false });
};

const setUserReady = async ({
  gameId,
  userId,
  isReady,
}: gameAndUserIdParam & {
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
          foCar.wpTire +
            foCar.wpGearbox +
            foCar.wpBrakes +
            foCar.wpEngine +
            foCar.wpChassis +
            foCar.wpShocks ==
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

const start = async ({ gameId }: gameIdParam) => {
  const foGame = await foGames.findByPk(gameId, {
    include: [
      {
        model: games,
        as: "game",
        include: [{ model: gamesUsers, as: "gamesUsers" }],
      },
      { model: foCars, as: "foCars" },
    ],
  });

  const gameUsers: gamesUsers[] = foGame.game.gamesUsers;

  // First, all users must be ready to start
  if (gameUsers.every((gameUser) => gameUser.readyState == readyStateE.ready)) {
    // We set the game to started
    await games.update(
      { gameStateId: gamesStateIdE.started },
      { where: { id: gameId } }
    );

    // We need to remove each user's excess cars
    //const gameCars = await foCars.findAll({ where: { gameId: gameId } });
    await Promise.all(
      gameUsers.map(async (gameUser) => {
        await Promise.all(
          foGame.foCars
            .filter((gameCar) => gameCar.userId == gameUser.userId)
            .map(async (gameCar, userCarIndex) => {
              if (userCarIndex >= foGame.carsPerPlayer) {
                await gameCar.destroy();
              }
            })
        );
      })
    );

    foGame.foCars = await foGame.getFoCars();

    // @todo Setting up pitstops global and for cars - later; for now zero stops - see next line
    foGame.foCars.forEach(
      (foCar) => (foCar.techPitstopsLeft = foGame.techPitstops)
    );

    // Make car teams - if 2 per player, then each player has team, otherwise assign first two cars team 1, second 2 team 2, ...
    if (foGame.carsPerPlayer == 2) {
      // Each player will have cars in the same team
      gameUsers.forEach((gameUser, teamNumber) =>
        foGame.foCars
          .filter((car) => car.userId == gameUser.userId)
          .forEach((car) => (car.team = teamNumber + 1))
      );
    } else {
      // Players do not have two cars each, then cars are randomly assigned to teams
      let teamNumber = 1;
      const maxTeamNumber = 5;
      foGame.foCars.sort(() => Math.random() - 0.5);
      foGame.foCars.forEach((car) => {
        car.team = teamNumber;
        // Roll through the team numbers
        teamNumber = teamNumber == maxTeamNumber ? 1 : teamNumber + 1;
      });
    }

    // Assign starting positions in random order and each car in "RACING" state
    foGame.foCars.sort(() => Math.random() - 0.5);

    const startingPositions = await foPositions.findAll({
      where: {
        foTrackId: foGame.foTrackId,
        startingPosition: { [Op.not]: null },
      },
      order: [["startingPosition", "ASC"]],
    });

    foGame.foCars.forEach((car, carIndex) => {
      car.foPositionId = startingPositions[carIndex].id;
      car.state = CarStateE.racing;
      car.order = carIndex + 1;
    });

    await Promise.all(foGame.foCars.map(async (car) => await car.save()));

    await processAutomaticActions({ gameId: gameId });

    return await getGame({ gameId: gameId });
  } else {
    throw new PreconditionRequiredError("All players must be in ready state");
  }
};

const getTrack = async (
  params: (gameIdParam | foTrackIdParam) & {
    include?: {
      foPosition2Position?: boolean;
      foPositionToFoPosition2Positions?: boolean;
    };
  }
) => {
  let foTrackId;
  if ("foTrackId" in params) {
    foTrackId = params.foTrackId;
  } else {
    foTrackId = (await foGames.findByPk(params.gameId)).foTrackId;
  }

  return await foTracks.findByPk(foTrackId, {
    include: [
      {
        model: foPositions,
        as: "foPositions",
        include: [
          params?.include?.foPosition2Position && {
            model: foPosition2Positions,
            as: "foPosition2Positions",
          },
          params?.include?.foPositionToFoPosition2Positions && {
            model: foPosition2Positions,
            as: "foPositionToFoPosition2Positions",
          },
          // This filters out null models, which would otherwise be invalid
        ].filter((model) => model),
      },
      { model: foCurves, as: "foCurves" },
    ],
  });
};

const processAutomaticActions = async ({ gameId }: gameIdParam) => {
  while (true) {
    const nextCar = await foCars.findOne({
      where: { gameId: gameId, order: { [Op.not]: null } },
      order: [["order", "ASC"]],
    });
    // @todo Figure out what to do with this - either enums or a function
    if (nextCar.gear == -1) {
      const blackDiceRoll = rollBlackDice();
      if (isSlowStart(blackDiceRoll)) {
        nextCar.gear = 0;
        nextCar.order = null;
        await foTurns
          .build({
            gameId: gameId,
            foCarId: nextCar.id,
            lap: nextCar.lap,
            foPositionId: nextCar.foPositionId,
            gear: 0,
            roll: 0,
          })
          .save();
        await nextCar.save();
        continue;
      } else if (isFastStart(blackDiceRoll)) {
        nextCar.gear = 1;
        await foTurns
          .build({ gameId: gameId, foCarId: nextCar.id, gear: 1, roll: 4 })
          .save();
        await nextCar.save();
        break;
      } else {
        nextCar.gear = 1;
        await foTurns
          .build({
            gameId: gameId,
            foCarId: nextCar.id,
            gear: 1,
            roll: rollGearDice(1),
          })
          .save();
        await nextCar.save();
        break;
      }
    } else if (nextCar.gear == 0) {
      nextCar.gear = 1;
      await foTurns
        .build({
          gameId: gameId,
          foCarId: nextCar.id,
          gear: 1,
          roll: rollGearDice(1),
        })
        .save();
      await nextCar.save();
      break;
    } else if (nextCar != null) {
      await foTurns.build({ gameId: gameId, foCarId: nextCar.id }).save();
      break;
    } else if (nextCar == null) {
      const racingCarsNumber = await foCars.count({
        where: { gameId: gameId, state: CarStateE.racing },
      });
      if (racingCarsNumber > 0) {
        await generateTurnOrder({ gameId: gameId });
        continue;
      } else {
        break;
      }
    }
  }
};

const generateTurnOrder = async ({ gameId }: gameIdParam) => {
  const cars = await foCars.findAll({
    where: { gameId: gameId, state: CarStateE.racing },
    order: [
      ["lap", "DESC"],
      ["foPositionId", "DESC"],
    ],
  });
  await Promise.all(
    cars.map(async (car, index) => {
      car.order = index + 1;
      await car.save();
    })
  );
};

const chooseGear = async ({
  gameId,
  carId,
  gear,
}: gameIdParam & { carId: number; gear: number }) => {
  const car = await foCars.findByPk(carId);

  if (gear > 6 || gear > car.gear + 1 || gear < 1) {
    throw new InvalidValueError(`Invalid value of gear (${gear})`);
  } else if (gear < car.gear - 1) {
    // Dealing the damage
    switch (car.gear - gear) {
      case 4:
        car.wpEngine--;
      case 3:
        car.wpBrakes--;
      case 2:
        car.wpGearbox--;
        break;
      default: // if the difference is bigger than 4, then it is invalid
        throw new InvalidValueError(
          `Invalid value of gear (${gear}), cannot downshift by 5`
        );
    }
    if (car.wpEngine < 1 || car.wpBrakes < 1 || car.wpGearbox < 1) {
      throw new InvalidValueError(
        `Invalid value of gear (${gear}), the car cannot sustain the damage`
      );
    }
  }

  // Perform the shifting after the damage was dealt
  car.gear = gear;
  const currentTurn = await foTurns.findOne({
    where: { foCarId: carId, gear: null },
  });
  currentTurn.gear = gear;
  currentTurn.roll = rollGearDice(gear);
  await currentTurn.save();
  await car.save();
  await processAutomaticActions({ gameId: gameId });
};

const getMoveOptions = async ({ gameId }: gameIdParam) => {
  const foGame = await foGames.findByPk(gameId, {
    include: [
      {
        model: games,
        as: "game",
        include: [{ model: gamesUsers, as: "gamesUsers" }],
      },
      {
        model: foCars,
        as: "foCars",
      },
      { model: foDebris, as: "foDebris" },
    ],
  });
  const fullGame: fullFormulaGame = {
    ...foGame.toJSON(),
    ...foGame.game.toJSON(),
  };
  const track = await foTracks.findByPk(fullGame.foTrackId, {
    include: [
      { model: foCurves, as: "foCurves" },
      {
        model: foPositions,
        as: "foPositions",
        include: [
          { model: foPosition2Positions, as: "foPosition2Positions" },
          {
            model: foPosition2Positions,
            as: "foPositionToFoPosition2Positions",
          },
        ],
      },
    ],
  });
  const foTurn = await foTurns.findOne({
    where: { gameId: gameId, foPositionId: null },
  });
  return getMos(fullGame, track, foTurn.roll);
};

const makeMove = async ({
  gameId,
  carId,
  traverse,
}: gameIdParam & { carId: number; traverse: number[] }) => {
  const game = await getGame({ gameId: gameId });
  const track = await getTrack({
    foTrackId: game.foTrackId,
    include: {
      foPosition2Position: true,
      foPositionToFoPosition2Positions: true,
    },
  });
  // @todo Introduce interface
  let damages:
    | false
    | {
        tire: number;
        brake: number;
        shocks: number;
        chassis: any[];
      };
  // @todo Get next lap info from validateMo as well and make sure that last move is calculated correctly
  if ((damages = validateMo(traverse, game, track))) {
    const car = await foCars.findByPk(carId);
    const finalPositionId =
      traverse.length > 0 ? traverse[traverse.length - 1] : car.foPositionId;
    car.foPositionId = finalPositionId;

    car.wpTire -= damages.tire;

    car.wpBrakes -= damages.brake;

    for (
      let shocksDamageRollsLeft = damages.shocks;
      shocksDamageRollsLeft > 0;
      shocksDamageRollsLeft--
    ) {
      if (isShocksDamage()) {
        car.wpShocks--;
      }
    }

    // @todo When collision, make a debris on the track
    const otherChassisDamages: foCars[] = [];
    for (const otherCarId of damages.chassis) {
      if (isCollision()) {
        car.wpChassis--;
      }
      if (isCollision()) {
        const otherCar = await foCars.findByPk(otherCarId);
        otherCar.wpChassis--;
        otherChassisDamages.push(otherCar);
        if (otherCar.wpChassis <= 0) {
          otherCar.state = CarStateE.retired;
        }
      }
    }

    if (car.wpShocks <= 0 || car.wpChassis <= 0) {
      car.state = CarStateE.retired;
    }

    const turn = await foTurns.findByPk(game.lastTurn.id);
    turn.foPositionId = finalPositionId;

    await Promise.all([
      car.save(),
      ...otherChassisDamages.map((dmg) => dmg.save()),
      turn.save(),
    ]);

    await processAutomaticActions({ gameId: gameId });
  } else {
    throw new InvalidValueError("Invalid traverse value");
  }
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
  chooseGear,
  getMoveOptions,
  makeMove,
};
export { gameSetup };
