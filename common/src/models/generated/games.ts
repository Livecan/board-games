import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { drResults, drResultsId } from './drResults';
import type { drTokensGames, drTokensGamesId } from './drTokensGames';
import type { drTurns, drTurnsId } from './drTurns';
import type { foCars, foCarsId } from './foCars';
import type { foDebris, foDebrisId } from './foDebris';
import type { foGames, foGamesCreationAttributes, foGamesId } from './foGames';
import type { gameStates, gameStatesId } from './gameStates';
import type { gameTypes, gameTypesId } from './gameTypes';
import type { gamesUsers, gamesUsersId } from './gamesUsers';
import type { users, usersId } from './users';

export interface gamesAttributes {
  id: number;
  name: string;
  minPlayers?: number;
  maxPlayers?: number;
  creatorId: number;
  gameStateId: number;
  gameTypeId: number;
  created: Date;
  modified: Date;
}

export type gamesPk = "id";
export type gamesId = games[gamesPk];
export type gamesOptionalAttributes = "id" | "minPlayers" | "maxPlayers" | "gameStateId" | "created" | "modified";
export type gamesCreationAttributes = Optional<gamesAttributes, gamesOptionalAttributes>;

export class games extends Model<gamesAttributes, gamesCreationAttributes> implements gamesAttributes {
  id!: number;
  name!: string;
  minPlayers?: number;
  maxPlayers?: number;
  creatorId!: number;
  gameStateId!: number;
  gameTypeId!: number;
  created!: Date;
  modified!: Date;

  // games belongsTo gameStates via gameStateId
  gameState!: gameStates;
  getGameState!: Sequelize.BelongsToGetAssociationMixin<gameStates>;
  setGameState!: Sequelize.BelongsToSetAssociationMixin<gameStates, gameStatesId>;
  createGameState!: Sequelize.BelongsToCreateAssociationMixin<gameStates>;
  // games belongsTo gameTypes via gameTypeId
  gameType!: gameTypes;
  getGameType!: Sequelize.BelongsToGetAssociationMixin<gameTypes>;
  setGameType!: Sequelize.BelongsToSetAssociationMixin<gameTypes, gameTypesId>;
  createGameType!: Sequelize.BelongsToCreateAssociationMixin<gameTypes>;
  // games hasMany drResults via gameId
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
  // games hasMany drTokensGames via gameId
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
  // games hasMany drTurns via gameId
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
  // games hasMany foCars via gameId
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
  // games hasMany foDebris via gameId
  foDebris!: foDebris[];
  getFoDebris!: Sequelize.HasManyGetAssociationsMixin<foDebris>;
  setFoDebris!: Sequelize.HasManySetAssociationsMixin<foDebris, foDebrisId>;
  addFoDebri!: Sequelize.HasManyAddAssociationMixin<foDebris, foDebrisId>;
  addFoDebris!: Sequelize.HasManyAddAssociationsMixin<foDebris, foDebrisId>;
  createFoDebri!: Sequelize.HasManyCreateAssociationMixin<foDebris>;
  removeFoDebri!: Sequelize.HasManyRemoveAssociationMixin<foDebris, foDebrisId>;
  removeFoDebris!: Sequelize.HasManyRemoveAssociationsMixin<foDebris, foDebrisId>;
  hasFoDebri!: Sequelize.HasManyHasAssociationMixin<foDebris, foDebrisId>;
  hasFoDebris!: Sequelize.HasManyHasAssociationsMixin<foDebris, foDebrisId>;
  countFoDebris!: Sequelize.HasManyCountAssociationsMixin;
  // games hasOne foGames via gameId
  foGame!: foGames;
  getFoGame!: Sequelize.HasOneGetAssociationMixin<foGames>;
  setFoGame!: Sequelize.HasOneSetAssociationMixin<foGames, foGamesId>;
  createFoGame!: Sequelize.HasOneCreateAssociationMixin<foGames>;
  // games hasMany gamesUsers via gameId
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
  // games belongsTo users via creatorId
  creator!: users;
  getCreator!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCreator!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCreator!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof games {
    return games.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    minPlayers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'min_players'
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_players'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'creator_id'
    },
    gameStateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'game_states',
        key: 'id'
      },
      field: 'game_state_id'
    },
    gameTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'game_types',
        key: 'id'
      },
      field: 'game_type_id'
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'games',
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
        name: "game_state_id",
        using: "BTREE",
        fields: [
          { name: "game_state_id" },
        ]
      },
      {
        name: "creator_id",
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
      {
        name: "game_type_id",
        using: "BTREE",
        fields: [
          { name: "game_type_id" },
        ]
      },
    ]
  });
  }
}
