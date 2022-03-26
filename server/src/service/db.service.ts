import { Dialect, Sequelize } from "sequelize";
import config from "../config/db.config";

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
  }
);

export default connection;
