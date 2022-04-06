import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foPositions, foPositionsId } from './foPositions';
import type { foTracks, foTracksId } from './foTracks';

export interface foCurvesAttributes {
  id: number;
  foTrackId: number;
  foNextCurveId?: number;
  stops: number;
  name?: string;
}

export type foCurvesPk = "id";
export type foCurvesId = foCurves[foCurvesPk];
export type foCurvesOptionalAttributes = "id" | "foNextCurveId" | "name";
export type foCurvesCreationAttributes = Optional<foCurvesAttributes, foCurvesOptionalAttributes>;

export class foCurves extends Model<foCurvesAttributes, foCurvesCreationAttributes> implements foCurvesAttributes {
  id!: number;
  foTrackId!: number;
  foNextCurveId?: number;
  stops!: number;
  name?: string;

  // foCurves hasMany foCars via foCurveId
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
  // foCurves belongsTo foCurves via foNextCurveId
  foNextCurve!: foCurves;
  getFoNextCurve!: Sequelize.BelongsToGetAssociationMixin<foCurves>;
  setFoNextCurve!: Sequelize.BelongsToSetAssociationMixin<foCurves, foCurvesId>;
  createFoNextCurve!: Sequelize.BelongsToCreateAssociationMixin<foCurves>;
  // foCurves hasMany foPositions via foCurveId
  foPositions!: foPositions[];
  getFoPositions!: Sequelize.HasManyGetAssociationsMixin<foPositions>;
  setFoPositions!: Sequelize.HasManySetAssociationsMixin<foPositions, foPositionsId>;
  addFoPosition!: Sequelize.HasManyAddAssociationMixin<foPositions, foPositionsId>;
  addFoPositions!: Sequelize.HasManyAddAssociationsMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.HasManyCreateAssociationMixin<foPositions>;
  removeFoPosition!: Sequelize.HasManyRemoveAssociationMixin<foPositions, foPositionsId>;
  removeFoPositions!: Sequelize.HasManyRemoveAssociationsMixin<foPositions, foPositionsId>;
  hasFoPosition!: Sequelize.HasManyHasAssociationMixin<foPositions, foPositionsId>;
  hasFoPositions!: Sequelize.HasManyHasAssociationsMixin<foPositions, foPositionsId>;
  countFoPositions!: Sequelize.HasManyCountAssociationsMixin;
  // foCurves belongsTo foTracks via foTrackId
  foTrack!: foTracks;
  getFoTrack!: Sequelize.BelongsToGetAssociationMixin<foTracks>;
  setFoTrack!: Sequelize.BelongsToSetAssociationMixin<foTracks, foTracksId>;
  createFoTrack!: Sequelize.BelongsToCreateAssociationMixin<foTracks>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foCurves {
    return foCurves.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    foTrackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_tracks',
        key: 'id'
      },
      field: 'fo_track_id'
    },
    foNextCurveId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_curves',
        key: 'id'
      },
      field: 'fo_next_curve_id'
    },
    stops: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fo_curves',
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
        name: "track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
      {
        name: "next_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_next_curve_id" },
        ]
      },
    ]
  });
  }
}
