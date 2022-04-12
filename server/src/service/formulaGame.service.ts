import { Op } from "sequelize";
import {
  carStateEnum as carStateE,
  damageTypeEnum as damageTypeE,
} from "../../../common/src/models/enums/formula";
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
import { foCars } from "../../../common/src/models/generated/foCars";
import { foCurves } from "../../../common/src/models/generated/foCurves";
import {
  foDamages,
  foDamagesAttributes,
} from "../../../common/src/models/generated/foDamages";
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

const getGame = async ({ gameId }: gameIdParam): Promise<fullFormulaGame> => {
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
      {
        model: foDebris,
        as: "foDebris",
      },
      {
        model: foTurns,
        as: "foTurns",
        where: {
          [Op.or]: [{ gear: null }, { foPositionId: null }],
        },
      },
    ],
  });
  const gameSetup = {
    ...game.toJSON(),
    ...game.foGame.toJSON(),
    lastTurn: game.foTurns.pop(),
    foTurns: null,
  } as fullFormulaGame;

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

  await gamesUsers.update(
    { readyState: readyStateE.notReady },
    { where: { gameId: gameId } }
  );
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
    await games.update(
      { gameStateId: gamesStateIdE.started },
      { where: { id: gameId } }
    );

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
      order: [["startingPosition", "ASC"]],
    });

    game.foCars.forEach((car, carIndex) => {
      car.foPositionId = startingPositions[carIndex].id;
      car.state = carStateE.racing;
      car.order = carIndex + 1;
    });

    await Promise.all(game.foCars.map(async (car) => await car.save()));

    await processAutomaticActions({ gameId: gameId });

    return await getGame({ gameId: gameId });
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
  for (;;) {
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
        where: { gameId: gameId, state: carStateE.racing },
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
    where: { gameId: gameId, state: carStateE.racing },
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
  const car = await foCars.findByPk(carId, {
    include: { model: foDamages, as: "foDamages" },
  });

  if (gear > 6 || gear > car.gear + 1 || gear < 1) {
    throw new InvalidValueError(`Invalid value of gear (${gear})`);
  } else if (gear < car.gear - 1) {
    // Dealing the damage
    const updateDamages: foDamages[] = [];
    switch (car.gear - gear) {
      case 4:
        updateDamages.push(
          car.foDamages.find((damage) => damage.type == damageTypeE.engine)
        );
      case 3:
        updateDamages.push(
          car.foDamages.find((damage) => damage.type == damageTypeE.brakes)
        );
      case 2:
        updateDamages.push(
          car.foDamages.find((damage) => damage.type == damageTypeE.gearbox)
        );
        break;
      default: // if the difference is bigger than 4, then it is invalid
        throw new InvalidValueError(
          `Invalid value of gear (${gear}), cannot downshift by 5`
        );
    }
    if (updateDamages.some((damage) => damage.wearPoints <= 1)) {
      throw new InvalidValueError(
        `Invalid value of gear (${gear}), the car cannot sustain the damage`
      );
    } else {
      await Promise.all(
        updateDamages.map((updateDamage) => {
          updateDamage.wearPoints--;
          updateDamage.save();
        })
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
  const game = await games.findByPk(gameId, {
    include: [
      { model: foGames, as: "foGame" },
      {
        model: foCars,
        as: "foCars",
        include: [{ model: foDamages, as: "foDamages" }],
      },
      { model: foDebris, as: "foDebris" },
      { model: gamesUsers, as: "gamesUsers" },
    ],
  });
  const fullGame: fullFormulaGame = {
    ...game.toJSON(),
    ...game.foGame.toJSON(),
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
    const car = await foCars.findByPk(carId, {
      include: { model: foDamages, as: "foDamages" },
    });
    const finalPositionId =
      traverse.length > 0 ? traverse[traverse.length - 1] : car.foPositionId;
    car.foPositionId = finalPositionId;

    const tireDamage = car.foDamages.find(
      (tireDmg) => tireDmg.type == damageTypeE.tire
    );
    tireDamage.wearPoints -= damages.tire;

    const brakeDamage = car.foDamages.find(
      (brakeDmg) => brakeDmg.type == damageTypeE.brakes
    );
    brakeDamage.wearPoints -= damages.brake;

    const shocksDamage = car.foDamages.find(
      (shocksDmg) => shocksDmg.type == damageTypeE.shocks
    );
    for (
      let shocksDamagePotential = damages.shocks;
      shocksDamagePotential > 0;
      shocksDamagePotential--
    ) {
      if (isShocksDamage()) {
        shocksDamage.wearPoints--;
      }
    }

    const chassisDamage = car.foDamages.find(
      (chassisDmg) => chassisDmg.type == damageTypeE.chassis
    );
    const otherChassisDamages: foDamages[] = [];
    const otherRetiredCarsToSave: foCars[] = [];
    for (const otherCarId of damages.chassis) {
      if (isCollision()) {
        chassisDamage.wearPoints--;
      }
      if (isCollision()) {
        const otherCarDamage = await foDamages.findOne({
          where: { foCarId: otherCarId, type: damageTypeE.chassis },
        });
        otherCarDamage.wearPoints--;
        otherChassisDamages.push(otherCarDamage);
        if (otherCarDamage.wearPoints <= 0) {
          const otherRetiredCar = await foCars.findByPk(otherCarId);
          otherRetiredCar.state = carStateE.retired;
          otherRetiredCarsToSave.push(otherRetiredCar);
        }
      }
    }

    if (shocksDamage.wearPoints <= 0 || chassisDamage.wearPoints <= 0) {
      car.state = carStateE.retired;
    }

    const turn = await foTurns.findByPk(game.lastTurn.id);
    turn.foPositionId = finalPositionId;

    await Promise.all([
      car.save(),
      tireDamage.save(),
      brakeDamage.save(),
      shocksDamage.save(),
      chassisDamage.save(),
      ...otherChassisDamages.map((dmg) => dmg.save()),
      ...otherRetiredCarsToSave.map((car) => car.save()),
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
