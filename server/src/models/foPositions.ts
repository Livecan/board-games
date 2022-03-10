import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCars, foCarsId } from './foCars';
import type { foCurves, foCurvesId } from './foCurves';
import type { foDebris, foDebrisId } from './foDebris';
import type { foLogs, foLogsId } from './foLogs';
import type { foMoveOptions, foMoveOptionsId } from './foMoveOptions';
import type { foPosition2Positions, foPosition2PositionsId } from './foPosition2Positions';
import type { foTracks, foTracksId } from './foTracks';
import type { foTraverses, foTraversesId } from './foTraverses';

export interface foPositionsAttributes {
  id: number;
  foTrackId: number;
  order: number;
  foCurveId?: number;
  isFinish: number;
  startingPosition?: number;
  teamPits?: number;
  posX: number;
  posY: number;
  angle?: number;
  angleInsertedManually?: number;
}

export type foPositionsPk = "id";
export type foPositionsId = foPositions[foPositionsPk];
export type foPositionsOptionalAttributes = "id" | "foCurveId" | "isFinish" | "startingPosition" | "teamPits" | "angle" | "angleInsertedManually";
export type foPositionsCreationAttributes = Optional<foPositionsAttributes, foPositionsOptionalAttributes>;

export class foPositions extends Model<foPositionsAttributes, foPositionsCreationAttributes> implements foPositionsAttributes {
  id!: number;
  foTrackId!: number;
  order!: number;
  foCurveId?: number;
  isFinish!: number;
  startingPosition?: number;
  teamPits?: number;
  posX!: number;
  posY!: number;
  angle?: number;
  angleInsertedManually?: number;

  // foPositions belongsTo foCurves via foCurveId
  foCurve!: foCurves;
  getFoCurve!: Sequelize.BelongsToGetAssociationMixin<foCurves>;
  setFoCurve!: Sequelize.BelongsToSetAssociationMixin<foCurves, foCurvesId>;
  createFoCurve!: Sequelize.BelongsToCreateAssociationMixin<foCurves>;
  // foPositions hasMany foCars via foPositionId
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
  // foPositions hasMany foDebris via foPositionId
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
  // foPositions hasMany foLogs via foPositionId
  foLogs!: foLogs[];
  getFoLogs!: Sequelize.HasManyGetAssociationsMixin<foLogs>;
  setFoLogs!: Sequelize.HasManySetAssociationsMixin<foLogs, foLogsId>;
  addFoLog!: Sequelize.HasManyAddAssociationMixin<foLogs, foLogsId>;
  addFoLogs!: Sequelize.HasManyAddAssociationsMixin<foLogs, foLogsId>;
  createFoLog!: Sequelize.HasManyCreateAssociationMixin<foLogs>;
  removeFoLog!: Sequelize.HasManyRemoveAssociationMixin<foLogs, foLogsId>;
  removeFoLogs!: Sequelize.HasManyRemoveAssociationsMixin<foLogs, foLogsId>;
  hasFoLog!: Sequelize.HasManyHasAssociationMixin<foLogs, foLogsId>;
  hasFoLogs!: Sequelize.HasManyHasAssociationsMixin<foLogs, foLogsId>;
  countFoLogs!: Sequelize.HasManyCountAssociationsMixin;
  // foPositions hasMany foMoveOptions via foPositionId
  foMoveOptions!: foMoveOptions[];
  getFoMoveOptions!: Sequelize.HasManyGetAssociationsMixin<foMoveOptions>;
  setFoMoveOptions!: Sequelize.HasManySetAssociationsMixin<foMoveOptions, foMoveOptionsId>;
  addFoMoveOption!: Sequelize.HasManyAddAssociationMixin<foMoveOptions, foMoveOptionsId>;
  addFoMoveOptions!: Sequelize.HasManyAddAssociationsMixin<foMoveOptions, foMoveOptionsId>;
  createFoMoveOption!: Sequelize.HasManyCreateAssociationMixin<foMoveOptions>;
  removeFoMoveOption!: Sequelize.HasManyRemoveAssociationMixin<foMoveOptions, foMoveOptionsId>;
  removeFoMoveOptions!: Sequelize.HasManyRemoveAssociationsMixin<foMoveOptions, foMoveOptionsId>;
  hasFoMoveOption!: Sequelize.HasManyHasAssociationMixin<foMoveOptions, foMoveOptionsId>;
  hasFoMoveOptions!: Sequelize.HasManyHasAssociationsMixin<foMoveOptions, foMoveOptionsId>;
  countFoMoveOptions!: Sequelize.HasManyCountAssociationsMixin;
  // foPositions hasMany foPosition2Positions via foPositionFromId
  foPosition2Positions!: foPosition2Positions[];
  getFoPosition2Positions!: Sequelize.HasManyGetAssociationsMixin<foPosition2Positions>;
  setFoPosition2Positions!: Sequelize.HasManySetAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  addFoPosition2Position!: Sequelize.HasManyAddAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  addFoPosition2Positions!: Sequelize.HasManyAddAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  createFoPosition2Position!: Sequelize.HasManyCreateAssociationMixin<foPosition2Positions>;
  removeFoPosition2Position!: Sequelize.HasManyRemoveAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  removeFoPosition2Positions!: Sequelize.HasManyRemoveAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  hasFoPosition2Position!: Sequelize.HasManyHasAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  hasFoPosition2Positions!: Sequelize.HasManyHasAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  countFoPosition2Positions!: Sequelize.HasManyCountAssociationsMixin;
  // foPositions hasMany foPosition2Positions via foPositionToId
  foPositionToFoPosition2Positions!: foPosition2Positions[];
  getFoPositionToFoPosition2Positions!: Sequelize.HasManyGetAssociationsMixin<foPosition2Positions>;
  setFoPositionToFoPosition2Positions!: Sequelize.HasManySetAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  addFoPositionToFoPosition2Position!: Sequelize.HasManyAddAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  addFoPositionToFoPosition2Positions!: Sequelize.HasManyAddAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  createFoPositionToFoPosition2Position!: Sequelize.HasManyCreateAssociationMixin<foPosition2Positions>;
  removeFoPositionToFoPosition2Position!: Sequelize.HasManyRemoveAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  removeFoPositionToFoPosition2Positions!: Sequelize.HasManyRemoveAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  hasFoPositionToFoPosition2Position!: Sequelize.HasManyHasAssociationMixin<foPosition2Positions, foPosition2PositionsId>;
  hasFoPositionToFoPosition2Positions!: Sequelize.HasManyHasAssociationsMixin<foPosition2Positions, foPosition2PositionsId>;
  countFoPositionToFoPosition2Positions!: Sequelize.HasManyCountAssociationsMixin;
  // foPositions hasMany foTraverses via foPositionId
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
  // foPositions belongsTo foTracks via foTrackId
  foTrack!: foTracks;
  getFoTrack!: Sequelize.BelongsToGetAssociationMixin<foTracks>;
  setFoTrack!: Sequelize.BelongsToSetAssociationMixin<foTracks, foTracksId>;
  createFoTrack!: Sequelize.BelongsToCreateAssociationMixin<foTracks>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foPositions {
    return foPositions.init({
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    isFinish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_finish'
    },
    startingPosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "NULL - not a starting position\r\nnumber - particular starting position",
      field: 'starting_position'
    },
    teamPits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'team_pits'
    },
    posX: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "per 100000 width",
      field: 'pos_x'
    },
    posY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "per 100000 height",
      field: 'pos_y'
    },
    angle: {
      type: DataTypes.DECIMAL(4,3),
      allowNull: true,
      comment: "in radians"
    },
    angleInsertedManually: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'angle_inserted_manually'
    }
  }, {
    sequelize,
    tableName: 'fo_positions',
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
        name: "starting_position",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
          { name: "starting_position" },
        ]
      },
      {
        name: "fo_track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
      {
        name: "fo_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_curve_id" },
        ]
      },
      {
        name: "order",
        using: "BTREE",
        fields: [
          { name: "order" },
        ]
      },
    ]
  });
  }
}
