import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foCurves, foCurvesId } from './foCurves';
import type { foDamages, foDamagesId } from './foDamages';
import type { foPositions, foPositionsId } from './foPositions';
import type { foTraverses, foTraversesId } from './foTraverses';

export interface foMoveOptionsAttributes {
  id: number;
  foCarId: number;
  foPositionId: number;
  isNextLap: number;
  foCurveId?: number;
  stops?: number;
}

export type foMoveOptionsPk = "id";
export type foMoveOptionsId = foMoveOptions[foMoveOptionsPk];
export type foMoveOptionsOptionalAttributes = "id" | "isNextLap" | "foCurveId" | "stops";
export type foMoveOptionsCreationAttributes = Optional<foMoveOptionsAttributes, foMoveOptionsOptionalAttributes>;

export class foMoveOptions extends Model<foMoveOptionsAttributes, foMoveOptionsCreationAttributes> implements foMoveOptionsAttributes {
  id!: number;
  foCarId!: number;
  foPositionId!: number;
  isNextLap!: number;
  foCurveId?: number;
  stops?: number;

  // foMoveOptions belongsTo foCars via foCarId
  foCar!: foCars;
  getFoCar!: Sequelize.BelongsToGetAssociationMixin<foCars>;
  setFoCar!: Sequelize.BelongsToSetAssociationMixin<foCars, foCarsId>;
  createFoCar!: Sequelize.BelongsToCreateAssociationMixin<foCars>;
  // foMoveOptions belongsTo foCurves via foCurveId
  foCurve!: foCurves;
  getFoCurve!: Sequelize.BelongsToGetAssociationMixin<foCurves>;
  setFoCurve!: Sequelize.BelongsToSetAssociationMixin<foCurves, foCurvesId>;
  createFoCurve!: Sequelize.BelongsToCreateAssociationMixin<foCurves>;
  // foMoveOptions hasMany foDamages via foMoveOptionId
  foDamages!: foDamages[];
  getFoDamages!: Sequelize.HasManyGetAssociationsMixin<foDamages>;
  setFoDamages!: Sequelize.HasManySetAssociationsMixin<foDamages, foDamagesId>;
  addFoDamage!: Sequelize.HasManyAddAssociationMixin<foDamages, foDamagesId>;
  addFoDamages!: Sequelize.HasManyAddAssociationsMixin<foDamages, foDamagesId>;
  createFoDamage!: Sequelize.HasManyCreateAssociationMixin<foDamages>;
  removeFoDamage!: Sequelize.HasManyRemoveAssociationMixin<foDamages, foDamagesId>;
  removeFoDamages!: Sequelize.HasManyRemoveAssociationsMixin<foDamages, foDamagesId>;
  hasFoDamage!: Sequelize.HasManyHasAssociationMixin<foDamages, foDamagesId>;
  hasFoDamages!: Sequelize.HasManyHasAssociationsMixin<foDamages, foDamagesId>;
  countFoDamages!: Sequelize.HasManyCountAssociationsMixin;
  // foMoveOptions hasMany foTraverses via foMoveOptionId
  foTraverses!: foTraverses[];
  getFoTraverses!: Sequelize.HasManyGetAssociationsMixin<foTraverses>;
  setFoTraverses!: Sequelize.HasManySetAssociationsMixin<foTraverses, foTraversesId>;
  addFoTraverse!: Sequelize.HasManyAddAssociationMixin<foTraverses, foTraversesId>;
  addFoTraverses!: Sequelize.HasManyAddAssociationsMixin<foTraverses, foTraversesId>;
  createFoTraverse!: Sequelize.HasManyCreateAssociationMixin<foTraverses>;
  removeFoTraverse!: Sequelize.HasManyRemoveAssociationMixin<foTraverses, foTraversesId>;
  removeFoTraverses!: Sequelize.HasManyRemoveAssociationsMixin<foTraverses, foTraversesId>;
  hasFoTraverse!: Sequelize.HasManyHasAssociationMixin<foTraverses, foTraversesId>;
  hasFoTraverses!: Sequelize.HasManyHasAssociationsMixin<foTraverses, foTraversesId>;
  countFoTraverses!: Sequelize.HasManyCountAssociationsMixin;
  // foMoveOptions belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foMoveOptions {
    return foMoveOptions.init({
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
    foPositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      },
      field: 'fo_position_id'
    },
    isNextLap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_next_lap'
    },
    foCurveId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_curves',
        key: 'id'
      },
      field: 'fo_curve_id'
    },
    stops: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fo_move_options',
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
        name: "fo_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_curve_id" },
        ]
      },
    ]
  });
  }
}
