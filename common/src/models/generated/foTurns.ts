import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foPositions, foPositionsId } from './foPositions';
import type { games, gamesId } from './games';

export interface foTurnsAttributes {
  id: number;
  gameId: number;
  foCarId: number;
  gear?: number;
  roll?: number;
  lap?: number;
  foPositionId?: number;
  created: Date;
  modified: Date;
}

export type foTurnsPk = "id";
export type foTurnsId = foTurns[foTurnsPk];
export type foTurnsOptionalAttributes = "id" | "gear" | "roll" | "lap" | "foPositionId" | "created" | "modified";
export type foTurnsCreationAttributes = Optional<foTurnsAttributes, foTurnsOptionalAttributes>;

export class foTurns extends Model<foTurnsAttributes, foTurnsCreationAttributes> implements foTurnsAttributes {
  id!: number;
  gameId!: number;
  foCarId!: number;
  gear?: number;
  roll?: number;
  lap?: number;
  foPositionId?: number;
  created!: Date;
  modified!: Date;

  // foTurns belongsTo foCars via foCarId
  foCar!: foCars;
  getFoCar!: Sequelize.BelongsToGetAssociationMixin<foCars>;
  setFoCar!: Sequelize.BelongsToSetAssociationMixin<foCars, foCarsId>;
  createFoCar!: Sequelize.BelongsToCreateAssociationMixin<foCars>;
  // foTurns belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;
  // foTurns belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foTurns {
    return foTurns.init({
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
    foCarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_cars',
        key: 'id'
      },
      field: 'fo_car_id'
    },
    gear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roll: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    foPositionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_positions',
        key: 'id'
      },
      field: 'fo_position_id'
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
    tableName: 'fo_turns',
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
        name: "fo_car_id",
        using: "BTREE",
        fields: [
          { name: "fo_car_id" },
        ]
      },
      {
        name: "game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "fo_position_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_id" },
        ]
      },
    ]
  });
  }
}
