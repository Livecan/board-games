import { games, gamesUsers } from "../models/init-models";
import { NotFoundError } from "../utils/errors";

const view = async (gameId: number): Promise<Object> => {
  // @todo Read about promise rejection problems here
  const game = await games.findByPk(gameId);
  if (game === null) {
    throw new NotFoundError();
  }
  return game;
};

const join = async (gameId: number, userId: number): Promise<void> => {
  const game = await games.findByPk(gameId);
  const gameUser = gamesUsers.build({ gameId: gameId, userId: userId });
  await gameUser.save();
};

export { view, join };
