import sqlConnection from "./db.service";
import { initModels, games } from "../models/init-models";
import { NotFoundError } from "../utils/errors";

const view = async (gameId : int) : Promise<Object> => {
  // @todo Read about promise rejection problems here
  const game = await games.findByPk(gameId);
  if (game === null) {
    throw new NotFoundError();
  }
console.log(game);
  return game;
};

export { view };
