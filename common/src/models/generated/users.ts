import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { drResults, drResultsId } from './drResults';
import type { drTokensGames, drTokensGamesId } from './drTokensGames';
import type { drTurns, drTurnsId } from './drTurns';
import type { foCars, foCarsId } from './foCars';
import type { games, gamesId } from './games';
import type { gamesUsers, gamesUsersId } from './gamesUsers';

export interface usersAttributes {
  id: number;
  name: string;
  password: string;
  isAdmin: number;
  isBeta: number;
}

export type usersPk = "id";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "id" | "isAdmin" | "isBeta";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: number;
  name!: string;
  password!: string;
  isAdmin!: number;
  isBeta!: number;

  // users hasMany drResults via userId
  drResults!: drResults[];
  getDrResults!: Sequelize.HasManyGetAssociationsMixin<drResults>;
  setDrResults!: Sequelize.HasManySetAssociationsMixin<drResults, drResultsId>;
  addDrResult!: Sequelize.HasManyAddAssociationMixin<drResults, drResultsId>;
  addDrResults!: Sequelize.HasManyAddAssociationsMixin<drResults, drResultsId>;
  createDrResult!: Sequelize.HasManyCreateAssociationMixin<drResults>;
  removeDrResult!: Sequelize.HasManyRemoveAssociationMixin<drResults, drResultsId>;
  removeDrResults!: Sequelize.HasManyRemoveAssociationsMixin<drResults, drResultsId>;
  hasDrResult!: Sequelize.HasManyHasAssociationMixin<drResults, drResultsId>;
  hasDrResults!: Sequelize.HasManyHasAssociationsMixin<drResults, drResultsId>;
  countDrResults!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany drTokensGames via userId
  drTokensGames!: drTokensGames[];
  getDrTokensGames!: Sequelize.HasManyGetAssociationsMixin<drTokensGames>;
  setDrTokensGames!: Sequelize.HasManySetAssociationsMixin<drTokensGames, drTokensGamesId>;
  addDrTokensGame!: Sequelize.HasManyAddAssociationMixin<drTokensGames, drTokensGamesId>;
  addDrTokensGames!: Sequelize.HasManyAddAssociationsMixin<drTokensGames, drTokensGamesId>;
  createDrTokensGame!: Sequelize.HasManyCreateAssociationMixin<drTokensGames>;
  removeDrTokensGame!: Sequelize.HasManyRemoveAssociationMixin<drTokensGames, drTokensGamesId>;
  removeDrTokensGames!: Sequelize.HasManyRemoveAssociationsMixin<drTokensGames, drTokensGamesId>;
  hasDrTokensGame!: Sequelize.HasManyHasAssociationMixin<drTokensGames, drTokensGamesId>;
  hasDrTokensGames!: Sequelize.HasManyHasAssociationsMixin<drTokensGames, drTokensGamesId>;
  countDrTokensGames!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany drTurns via userId
  drTurns!: drTurns[];
  getDrTurns!: Sequelize.HasManyGetAssociationsMixin<drTurns>;
  setDrTurns!: Sequelize.HasManySetAssociationsMixin<drTurns, drTurnsId>;
  addDrTurn!: Sequelize.HasManyAddAssociationMixin<drTurns, drTurnsId>;
  addDrTurns!: Sequelize.HasManyAddAssociationsMixin<drTurns, drTurnsId>;
  createDrTurn!: Sequelize.HasManyCreateAssociationMixin<drTurns>;
  removeDrTurn!: Sequelize.HasManyRemoveAssociationMixin<drTurns, drTurnsId>;
  removeDrTurns!: Sequelize.HasManyRemoveAssociationsMixin<drTurns, drTurnsId>;
  hasDrTurn!: Sequelize.HasManyHasAssociationMixin<drTurns, drTurnsId>;
  hasDrTurns!: Sequelize.HasManyHasAssociationsMixin<drTurns, drTurnsId>;
  countDrTurns!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany foCars via userId
  foCars!: foCars[];
  getFoCars!: Sequelize.HasManyGetAssociationsMixin<foCars>;
  setFoCars!: Sequelize.HasManySetAssociationsMixin<foCars, foCarsId>;
  addFoCar!: Sequelize.HasManyAddAssociationMixin<foCars, foCarsId>;
  addFoCars!: Sequelize.HasManyAddAssociationsMixin<foCars, foCarsId>;
  createFoCar!: Sequelize.HasManyCreateAssociationMixin<foCars>;
  removeFoCar!: Sequelize.HasManyRemoveAssociationMixin<foCars, foCarsId>;
  removeFoCars!: Sequelize.HasManyRemoveAssociationsMixin<foCars, foCarsId>;
  hasFoCar!: Sequelize.HasManyHasAssociationMixin<foCars, foCarsId>;
  hasFoCars!: Sequelize.HasManyHasAssociationsMixin<foCars, foCarsId>;
  countFoCars!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany games via creatorId
  games!: games[];
  getGames!: Sequelize.HasManyGetAssociationsMixin<games>;
  setGames!: Sequelize.HasManySetAssociationsMixin<games, gamesId>;
  addGame!: Sequelize.HasManyAddAssociationMixin<games, gamesId>;
  addGames!: Sequelize.HasManyAddAssociationsMixin<games, gamesId>;
  createGame!: Sequelize.HasManyCreateAssociationMixin<games>;
  removeGame!: Sequelize.HasManyRemoveAssociationMixin<games, gamesId>;
  removeGames!: Sequelize.HasManyRemoveAssociationsMixin<games, gamesId>;
  hasGame!: Sequelize.HasManyHasAssociationMixin<games, gamesId>;
  hasGames!: Sequelize.HasManyHasAssociationsMixin<games, gamesId>;
  countGames!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany gamesUsers via userId
  gamesUsers!: gamesUsers[];
  getGamesUsers!: Sequelize.HasManyGetAssociationsMixin<gamesUsers>;
  setGamesUsers!: Sequelize.HasManySetAssociationsMixin<gamesUsers, gamesUsersId>;
  addGamesUser!: Sequelize.HasManyAddAssociationMixin<gamesUsers, gamesUsersId>;
  addGamesUsers!: Sequelize.HasManyAddAssociationsMixin<gamesUsers, gamesUsersId>;
  createGamesUser!: Sequelize.HasManyCreateAssociationMixin<gamesUsers>;
  removeGamesUser!: Sequelize.HasManyRemoveAssociationMixin<gamesUsers, gamesUsersId>;
  removeGamesUsers!: Sequelize.HasManyRemoveAssociationsMixin<gamesUsers, gamesUsersId>;
  hasGamesUser!: Sequelize.HasManyHasAssociationMixin<gamesUsers, gamesUsersId>;
  hasGamesUsers!: Sequelize.HasManyHasAssociationsMixin<gamesUsers, gamesUsersId>;
  countGamesUsers!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany gamesUsers via nextUserId
  nextUserGamesUsers!: gamesUsers[];
  getNextUserGamesUsers!: Sequelize.HasManyGetAssociationsMixin<gamesUsers>;
  setNextUserGamesUsers!: Sequelize.HasManySetAssociationsMixin<gamesUsers, gamesUsersId>;
  addNextUserGamesUser!: Sequelize.HasManyAddAssociationMixin<gamesUsers, gamesUsersId>;
  addNextUserGamesUsers!: Sequelize.HasManyAddAssociationsMixin<gamesUsers, gamesUsersId>;
  createNextUserGamesUser!: Sequelize.HasManyCreateAssociationMixin<gamesUsers>;
  removeNextUserGamesUser!: Sequelize.HasManyRemoveAssociationMixin<gamesUsers, gamesUsersId>;
  removeNextUserGamesUsers!: Sequelize.HasManyRemoveAssociationsMixin<gamesUsers, gamesUsersId>;
  hasNextUserGamesUser!: Sequelize.HasManyHasAssociationMixin<gamesUsers, gamesUsersId>;
  hasNextUserGamesUsers!: Sequelize.HasManyHasAssociationsMixin<gamesUsers, gamesUsersId>;
  countNextUserGamesUsers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_admin'
    },
    isBeta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_beta'
    }
  }, {
    sequelize,
    tableName: 'users',
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
    ]
  });
  }
}
