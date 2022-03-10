import { Sequelize } from "sequelize";
import config from "../config/db.config";

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    // @ts-ignore
    dialect: config.dialect,
  }
);

export default connection;
