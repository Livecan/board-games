import { foCars } from "../models/foCars";
import { foDamages, foDamagesAttributes } from "../models/foDamages";
import { foGames, foGamesAttributes } from "../models/foGames";
import { foTracks } from "../models/foTracks";
import { games, gamesAttributes } from "../models/games";
import { gamesUsers } from "../models/gamesUsers";
import { users, usersAttributes } from "../models/users";
import { NotFoundError } from "../utils/errors";

const config = {
  maxCarsPerPlayer: 15,
};

const add = async (
  user: usersAttributes,
  name: string | null
): Promise<number> => {
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
    await addCar(user.id, game.id);
  }
  try {
    return game.id;
  } catch (e) {
    throw e;
  }
};

const view = async (gameId: number): Promise<Object> => {
  // @todo Consider promise rejection problems here
  const game = await games.findByPk(gameId, {
    include: [
      {
        model: gamesUsers,
        as: "gamesUsers",
        // @ts-ignore
        include: { model: users, as: "user", attributes: ["id", "name"] },
      },
      { model: foGames, as: "foGame" },
    ],
  });
const addCar = async (userId: number, gameId: number): Promise<foCars> => {
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

const getGameSetup = async (gameId: number): Promise<gameSetup> => {
  const game = await games.findByPk(gameId, {
    include: [
      { model: foGames, as: "foGame" },
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

const editGameSetup = async (gameId: number, gameSetup: gameSetup) => {
  const game = await games.findByPk(gameId, {
    include: { model: foGames, as: "foGame" },
  });
  for (const [property, value] of Object.entries(gameSetup)) {
    game[property] = value;
    game.foGame[property] = value;
  }
  await game.save();
};

const editCarSetup = async (
  gameId: number,
  foCarId: number,
  foCarDamages: [foDamagesAttributes]
) => {
  const currentDamages = await foDamages.findAll({
    where: { foCarId: foCarId },
  });
  for (const foCarDamage of foCarDamages) {
    const currentDamage = currentDamages.find(
      (currentDamage) => currentDamage.type == foCarDamage.type
    );
    currentDamage.wearPoints = foCarDamage.wearPoints;
    currentDamage.save();
  }
  // @todo update foCar damages
};

export { add, view, getGameSetup, editGameSetup, gameSetup, editCarSetup };
