import sequelize from "sequelize";
import { gamesStateIdEnum as gamesStateIdE } from "../../../common/src/models/enums/game";
import { games, gamesUsers } from "../../../common/src/models/generated/init-models";
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

const getRecentNewGameModified = async (): Promise<Date> => {
  return new Date(await games.max("modified", { where: { gameStateId: 1 } }));
};

const getNewGames = async () => {
  return await games.findAll({
    where: { gameStateId: gamesStateIdE.new },
    order: [[sequelize.col("modified"), "DESC"]],
  });
};

export default { view, join, getRecentNewGameModified, getNewGames };
