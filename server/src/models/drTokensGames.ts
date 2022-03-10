import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { drTokenStates, drTokenStatesId } from './drTokenStates';
import type { drTokens, drTokensId } from './drTokens';
import type { games, gamesId } from './games';
import type { users, usersId } from './users';

export interface drTokensGamesAttributes {
  id: number;
  gameId: number;
  drTokenId: number;
  position?: number;
  userId?: number;
  groupNumber?: number;
  drTokenStateId: number;
}

export type drTokensGamesPk = "id";
export type drTokensGamesId = drTokensGames[drTokensGamesPk];
export type drTokensGamesOptionalAttributes = "id" | "position" | "userId" | "groupNumber" | "drTokenStateId";
export type drTokensGamesCreationAttributes = Optional<drTokensGamesAttributes, drTokensGamesOptionalAttributes>;

export class drTokensGames extends Model<drTokensGamesAttributes, drTokensGamesCreationAttributes> implements drTokensGamesAttributes {
  id!: number;
  gameId!: number;
  drTokenId!: number;
  position?: number;
  userId?: number;
  groupNumber?: number;
  drTokenStateId!: number;

  // drTokensGames belongsTo drTokenStates via drTokenStateId
  drTokenState!: drTokenStates;
  getDrTokenState!: Sequelize.BelongsToGetAssociationMixin<drTokenStates>;
  setDrTokenState!: Sequelize.BelongsToSetAssociationMixin<drTokenStates, drTokenStatesId>;
  createDrTokenState!: Sequelize.BelongsToCreateAssociationMixin<drTokenStates>;
  // drTokensGames belongsTo drTokens via drTokenId
  drToken!: drTokens;
  getDrToken!: Sequelize.BelongsToGetAssociationMixin<drTokens>;
  setDrToken!: Sequelize.BelongsToSetAssociationMixin<drTokens, drTokensId>;
  createDrToken!: Sequelize.BelongsToCreateAssociationMixin<drTokens>;
  // drTokensGames belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;
  // drTokensGames belongsTo users via userId
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof drTokensGames {
    return drTokensGames.init({
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
    drTokenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dr_tokens',
        key: 'id'
      },
      field: 'dr_token_id'
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    groupNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'group_number'
    },
    drTokenStateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'dr_token_states',
        key: 'id'
      },
      field: 'dr_token_state_id'
    }
  }, {
    sequelize,
    tableName: 'dr_tokens_games',
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
        name: "GAME_TOKEN_GAME_ID",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "GAME_TOKEN_TOKEN_ID",
        using: "BTREE",
        fields: [
          { name: "dr_token_id" },
        ]
      },
      {
        name: "PLAYER_ID",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "dr_tokens_games_ibfk_4",
        using: "BTREE",
        fields: [
          { name: "dr_token_state_id" },
        ]
      },
    ]
  });
  }
}
