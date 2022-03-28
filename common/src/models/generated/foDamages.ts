import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foLogs, foLogsId } from './foLogs';
import type { foMoveOptions, foMoveOptionsId } from './foMoveOptions';

export interface foDamagesAttributes {
  id: number;
  foCarId?: number;
  foMoveOptionId?: number;
  foLogId?: number;
  wearPoints: number;
  type: number;
  created: Date;
  modified: Date;
}

export type foDamagesPk = "id";
export type foDamagesId = foDamages[foDamagesPk];
export type foDamagesOptionalAttributes = "id" | "foCarId" | "foMoveOptionId" | "foLogId" | "created" | "modified";
export type foDamagesCreationAttributes = Optional<foDamagesAttributes, foDamagesOptionalAttributes>;

export class foDamages extends Model<foDamagesAttributes, foDamagesCreationAttributes> implements foDamagesAttributes {
  id!: number;
  foCarId?: number;
  foMoveOptionId?: number;
  foLogId?: number;
  wearPoints!: number;
  type!: number;
  created!: Date;
  modified!: Date;

  // foDamages belongsTo foCars via foCarId
  foCar!: foCars;
  getFoCar!: Sequelize.BelongsToGetAssociationMixin<foCars>;
  setFoCar!: Sequelize.BelongsToSetAssociationMixin<foCars, foCarsId>;
  createFoCar!: Sequelize.BelongsToCreateAssociationMixin<foCars>;
  // foDamages belongsTo foLogs via foLogId
  foLog!: foLogs;
  getFoLog!: Sequelize.BelongsToGetAssociationMixin<foLogs>;
  setFoLog!: Sequelize.BelongsToSetAssociationMixin<foLogs, foLogsId>;
  createFoLog!: Sequelize.BelongsToCreateAssociationMixin<foLogs>;
  // foDamages belongsTo foMoveOptions via foMoveOptionId
  foMoveOption!: foMoveOptions;
  getFoMoveOption!: Sequelize.BelongsToGetAssociationMixin<foMoveOptions>;
  setFoMoveOption!: Sequelize.BelongsToSetAssociationMixin<foMoveOptions, foMoveOptionsId>;
  createFoMoveOption!: Sequelize.BelongsToCreateAssociationMixin<foMoveOptions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foDamages {
    return foDamages.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    foCarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_cars',
        key: 'id'
      },
      field: 'fo_car_id'
    },
    foMoveOptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_move_options',
        key: 'id'
      },
      field: 'fo_move_option_id'
    },
    foLogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_logs',
        key: 'id'
      },
      field: 'fo_log_id'
    },
    wearPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'wear_points'
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 - Tires,\r\n2 - Gearbox,\r\n3 - Brakes,\r\n4 - Engine,\r\n5 - Chassis,\r\n6 - Shocks"
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
    tableName: 'fo_damages',
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
        name: "fo_move_option_id",
        using: "BTREE",
        fields: [
          { name: "fo_move_option_id" },
        ]
      },
      {
        name: "fo_history_id",
        using: "BTREE",
        fields: [
          { name: "fo_log_id" },
        ]
      },
      {
        name: "fo_e_damage_type_id",
        using: "BTREE",
        fields: [
          { name: "type" },
        ]
      },
      {
        name: "created",
        using: "BTREE",
        fields: [
          { name: "created" },
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
        name: "fo_car_damage_type",
        using: "BTREE",
        fields: [
          { name: "fo_car_id" },
          { name: "type" },
        ]
      },
    ]
  });
  }
}
