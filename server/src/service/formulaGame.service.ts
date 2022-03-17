import { foCars } from "../models/foCars";
import { foDamages, foDamagesAttributes } from "../models/foDamages";
import { foEDamageTypes } from "../models/foEDamageTypes";
import { foGames, foGamesAttributes } from "../models/foGames";
import { foTracks } from "../models/foTracks";
import { games, gamesAttributes } from "../models/games";
import { gamesUsers } from "../models/gamesUsers";
import { users, usersAttributes } from "../models/users";

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

const getGameSetup = async ({
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
        // @ts-ignore
        include: [{ model: users, as: "user", attributes: ["id", "name"] }],
      },
      {
        model: foCars,
        as: "foCars",
        // @ts-ignore
        include: { model: foDamages, as: "foDamages" },
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

  // @todo Move the constant out
  await gamesUsers.update({ readyState: "N" }, { where: { gameId: gameId } });
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
    // @todo Move this value "N" into a constants file
    await gamesUsers.update(
      { readyState: "N" },
      { where: { gameId: gameId, userId: userId } }
    );
    return;
  } else {
    const game = await getGameSetup({ gameId: gameId });

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
      // @todo Move this value "R" into a constants file
      await gamesUsers.update(
        { readyState: "R" },
        { where: { gameId: gameId, userId: userId } }
      );
    }
    return;
  }
};

export default {
  add,
  join,
  getGameSetup,
  editGameSetup,
  editCarSetup,
  setUserReady,
};
export { gameSetup };
