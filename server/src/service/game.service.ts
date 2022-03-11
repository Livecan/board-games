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

const join = async (gameId: number, userId: number): Promise<games> => {
  const game = await games.findByPk(gameId);
  try {
    const gameUser = await gamesUsers.findOrCreate({
      where: { gameId: gameId, userId: userId },
    });
    return game;
  } catch (e) {
    throw e;
  }
};

export { view, join };
