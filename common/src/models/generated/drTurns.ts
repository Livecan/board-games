import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { games, gamesId } from './games';
import type { users, usersId } from './users';

export interface drTurnsAttributes {
  id: number;
  gameId: number;
  userId: number;
  position: number;
  round: number;
  roll: string;
  returning: number;
  taking: number;
  dropping: number;
  oxygen: number;
  created: Date;
  modified: Date;
}

export type drTurnsPk = "id";
export type drTurnsId = drTurns[drTurnsPk];
export type drTurnsOptionalAttributes = "id" | "returning" | "taking" | "dropping" | "oxygen" | "created" | "modified";
export type drTurnsCreationAttributes = Optional<drTurnsAttributes, drTurnsOptionalAttributes>;

export class drTurns extends Model<drTurnsAttributes, drTurnsCreationAttributes> implements drTurnsAttributes {
  id!: number;
  gameId!: number;
  userId!: number;
  position!: number;
  round!: number;
  roll!: string;
  returning!: number;
  taking!: number;
  dropping!: number;
  oxygen!: number;
  created!: Date;
  modified!: Date;

  // drTurns belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;
  // drTurns belongsTo users via userId
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof drTurns {
    return drTurns.init({
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
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roll: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    returning: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    taking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    dropping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    oxygen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
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
    tableName: 'dr_turns',
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
    ]
  });
  }
}
