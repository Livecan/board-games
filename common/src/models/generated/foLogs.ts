import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foPositions, foPositionsId } from './foPositions';

export interface foLogsAttributes {
  id: number;
  foCarId: number;
  lap?: number;
  foPositionId?: number;
  gear?: number;
  roll?: number;
  damageType?: number;
  type: string;
  created: Date;
  modified: Date;
}

export type foLogsPk = "id";
export type foLogsId = foLogs[foLogsPk];
export type foLogsOptionalAttributes = "id" | "lap" | "foPositionId" | "gear" | "roll" | "damageType" | "created" | "modified";
export type foLogsCreationAttributes = Optional<foLogsAttributes, foLogsOptionalAttributes>;

export class foLogs extends Model<foLogsAttributes, foLogsCreationAttributes> implements foLogsAttributes {
  id!: number;
  foCarId!: number;
  lap?: number;
  foPositionId?: number;
  gear?: number;
  roll?: number;
  damageType?: number;
  type!: string;
  created!: Date;
  modified!: Date;

  // foLogs belongsTo foCars via foCarId
  foCar!: foCars;
  getFoCar!: Sequelize.BelongsToGetAssociationMixin<foCars>;
  setFoCar!: Sequelize.BelongsToSetAssociationMixin<foCars, foCarsId>;
  createFoCar!: Sequelize.BelongsToCreateAssociationMixin<foCars>;
  // foLogs belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foLogs {
    return foLogs.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    gear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roll: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    damageType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "values according to fo_damages.type",
      field: 'damage_type'
    },
    type: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      comment: "I - initial\\nM - move\\nD - damage\\nR - repair\\nF - finish\\nP - leaving pits"
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
    tableName: 'fo_logs',
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
        name: "fo_position_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_id" },
        ]
      },
      {
        name: "modified",
        using: "BTREE",
        fields: [
          { name: "modified" },
        ]
      },
      {
        name: "created",
        using: "BTREE",
        fields: [
          { name: "created" },
        ]
      },
    ]
  });
  }
}
