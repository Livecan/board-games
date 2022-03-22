import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { games, gamesId } from './games';
import type { users, usersId } from './users';

export interface drResultsAttributes {
  id: number;
  gameId: number;
  userId: number;
  score: number;
}

export type drResultsPk = "id";
export type drResultsId = drResults[drResultsPk];
export type drResultsOptionalAttributes = "id";
export type drResultsCreationAttributes = Optional<drResultsAttributes, drResultsOptionalAttributes>;

export class drResults extends Model<drResultsAttributes, drResultsCreationAttributes> implements drResultsAttributes {
  id!: number;
  gameId!: number;
  userId!: number;
  score!: number;

  // drResults belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;
  // drResults belongsTo users via userId
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof drResults {
    return drResults.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      },
      field: 'game_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dr_results',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "games_users_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
    ]
  });
  }
}
