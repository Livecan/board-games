import { foCarsAttributes } from "../models/foCars";
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
  await Promise.all([
    gamesUsers.build({ userId: user.id, gameId: game.id }).save(),
    foGames
      .build({ gameId: game.id, foTrackId: foTrackId, carsPerPlayer: 2 })
      .save(),
  ]);
  try {
    return await games.findByPk(game.id, {
      include: [
        { model: gamesUsers, as: "gamesUsers" },
        { model: foGames, as: "foGame" },
      ],
    });
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

interface editCarSetup {
  // @todo Move this hard-coded value in a const
  type: "edit-car";
  foCar: foCarsAttributes;
}

type gameSetup = foGamesAttributes & gamesAttributes;

interface editGameSetup {
  // @todo Move this hard-coded value in a const
  type: "edit-setup";
  gameSetup: gameSetup;
}

const getGameSetup = async (gameId: number): Promise<gameSetup> => {
  const game = await games.findByPk(gameId, {
    include: { model: foGames, as: "foGame" },
  });
  const gameSetup = { ...game.toJSON(), ...game.foGame.toJSON() };
  delete gameSetup.foGame;
  return gameSetup;
};

const editGameSetup = async (gameId: number, gameSetup: editGameSetup) => {
  const game = await games.findByPk(gameId, {
    include: { model: foGames, as: "foGame" },
  });
  for (const [property, value] of Object.entries(gameSetup)) {
    game[property] = value;
    game.foGame[property] = value;
  }
  await game.save();
};

export { add, view, getGameSetup, editGameSetup, editCarSetup };
