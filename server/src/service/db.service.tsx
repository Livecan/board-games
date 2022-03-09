import { Sequelize } from "sequelize";

const connection = new Sequelize('games', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

export default connection;
