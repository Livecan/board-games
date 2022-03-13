import { foGames } from "../models/foGames";
import { foTracks } from "../models/foTracks";
import { games } from "../models/games";
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
        include: {
          model: users,
          as: "user",
          attributes: { exclude: ["password"] },
        },
      },
      { model: foGames, as: "foGame" },
    ],
  });
  if (game === null) {
    throw new NotFoundError();
  }
  game.gamesUsers.forEach((gameUser) => delete gameUser.user.password);
  return game;
};

export { add, view };
