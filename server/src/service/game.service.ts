import sequelize from "sequelize";
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

const getRecentNewGameModified = async () => {
  return await games.findAll({where: {gameStateId: 1}, attributes: [[sequelize.fn('max', sequelize.col('modified')), 'recentlyModified']]});
}

const getNewGames = async () => {
  // @todo Put gameStateId into a relevant place for constants
  return await games.findAll({where: {gameStateId: 1}, order: [[sequelize.col('modified'), 'DESC']]});
}

export { view, join, getRecentNewGameModified, getNewGames };
