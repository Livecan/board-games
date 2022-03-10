import { foGames } from "../models/foGames";
import { games } from "../models/games";
import { gamesUsers } from "../models/gamesUsers";

const add = async (userId: number): Promise<number> => {
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

  return game.id;
};

export { add };
