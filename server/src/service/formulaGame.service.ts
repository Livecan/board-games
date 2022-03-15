import { foCars } from "../models/foCars";
import { foDamages, foDamagesAttributes } from "../models/foDamages";
import { foGames, foGamesAttributes } from "../models/foGames";
import { foTracks } from "../models/foTracks";
import { games, gamesAttributes } from "../models/games";
import { gamesUsers } from "../models/gamesUsers";
import { users } from "../models/users";
import { NotFoundError } from "../utils/errors";

const add = async (user: users, name: string | null): Promise<games> => {
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
  await foGames
    .build({ gameId: game.id, foTrackId: foTrackId, carsPerPlayer: 2 })
    .save();
  // @todo: initialize cars - in a separate function that will be shared
  try {
    // @todo: use the get setup function here instead
    return game;
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
  if (game === null) {
    throw new NotFoundError();
  }
  return game;
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
