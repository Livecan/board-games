import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { games, gamesId } from './games';
import type { users, usersId } from './users';

export interface gamesUsersAttributes {
  id: number;
  gameId: number;
  userId: number;
  readyState: string;
  orderNumber?: number;
  nextUserId?: number;
  lastRequest: Date;
}

export type gamesUsersPk = "id";
export type gamesUsersId = gamesUsers[gamesUsersPk];
export type gamesUsersOptionalAttributes = "id" | "readyState" | "orderNumber" | "nextUserId" | "lastRequest";
export type gamesUsersCreationAttributes = Optional<gamesUsersAttributes, gamesUsersOptionalAttributes>;

export class gamesUsers extends Model<gamesUsersAttributes, gamesUsersCreationAttributes> implements gamesUsersAttributes {
  id!: number;
  gameId!: number;
  userId!: number;
  readyState!: string;
  orderNumber?: number;
  nextUserId?: number;
  lastRequest!: Date;

  // gamesUsers belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;
  // gamesUsers belongsTo users via userId
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // gamesUsers belongsTo users via nextUserId
  nextUser!: users;
  getNextUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setNextUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createNextUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof gamesUsers {
    return gamesUsers.init({
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
    readyState: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      comment: "R - ready,\r\nN - not ready",
      field: 'ready_state'
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'order_number'
    },
    nextUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'next_user_id'
    },
    lastRequest: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_request'
    }
  }, {
    sequelize,
    tableName: 'games_users',
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
        name: "game_id_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "Game_ID",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "Player_ID",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "next_user_id",
        using: "BTREE",
        fields: [
          { name: "next_user_id" },
        ]
      },
    ]
  });
  }
}
