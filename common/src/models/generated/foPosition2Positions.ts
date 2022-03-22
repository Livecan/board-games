import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foPositions, foPositionsId } from './foPositions';

export interface foPosition2PositionsAttributes {
  id: number;
  foPositionFromId: number;
  foPositionToId: number;
  isLeft: number;
  isStraight: number;
  isRight: number;
  isCurve: number;
  isAdjacent: number;
  isEqualDistance: number;
  isPitlaneMove: number;
}

export type foPosition2PositionsPk = "id";
export type foPosition2PositionsId = foPosition2Positions[foPosition2PositionsPk];
export type foPosition2PositionsOptionalAttributes = "id" | "isLeft" | "isStraight" | "isRight" | "isCurve" | "isEqualDistance" | "isPitlaneMove";
export type foPosition2PositionsCreationAttributes = Optional<foPosition2PositionsAttributes, foPosition2PositionsOptionalAttributes>;

export class foPosition2Positions extends Model<foPosition2PositionsAttributes, foPosition2PositionsCreationAttributes> implements foPosition2PositionsAttributes {
  id!: number;
  foPositionFromId!: number;
  foPositionToId!: number;
  isLeft!: number;
  isStraight!: number;
  isRight!: number;
  isCurve!: number;
  isAdjacent!: number;
  isEqualDistance!: number;
  isPitlaneMove!: number;

  // foPosition2Positions belongsTo foPositions via foPositionFromId
  foPositionFrom!: foPositions;
  getFoPositionFrom!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPositionFrom!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPositionFrom!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;
  // foPosition2Positions belongsTo foPositions via foPositionToId
  foPositionTo!: foPositions;
  getFoPositionTo!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPositionTo!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPositionTo!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foPosition2Positions {
    return foPosition2Positions.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    foPositionFromId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      },
      field: 'fo_position_from_id'
    },
    foPositionToId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      },
      field: 'fo_position_to_id'
    },
    isLeft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_left'
    },
    isStraight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_straight'
    },
    isRight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_right'
    },
    isCurve: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_curve'
    },
    isAdjacent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_adjacent'
    },
    isEqualDistance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_equal_distance'
    },
    isPitlaneMove: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_pitlane_move'
    }
  }, {
    sequelize,
    tableName: 'fo_position2positions',
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
        name: "fo_position_from_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_from_id" },
        ]
      },
      {
        name: "fo_position_to_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_to_id" },
        ]
      },
    ]
  });
  }
}
