import { foGames } from "../models/foGames";
import { games } from "../models/games";
import { gamesUsers } from "../models/gamesUsers";

const add = async (userId: number): Promise<games> => {
  const game = games.build({
    name: `userId`,
    maxPlayers: 8,
    creatorId: userId,
    gameTypeId: 2,
  });
  await game.save();
  await gamesUsers.build({ userId: userId, gameId: game.id }).save();
  await foGames
    .build({ gameId: game.id, foTrackId: 1, carsPerPlayer: 2 })
    .save();
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

export { add };
