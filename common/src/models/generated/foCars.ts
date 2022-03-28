import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCurves, foCurvesId } from './foCurves';
import type { foDamages, foDamagesId } from './foDamages';
import type { foLogs, foLogsId } from './foLogs';
import type { foMoveOptions, foMoveOptionsId } from './foMoveOptions';
import type { foPositions, foPositionsId } from './foPositions';
import type { foTurns, foTurnsId } from './foTurns';
import type { games, gamesId } from './games';
import type { users, usersId } from './users';

export interface foCarsAttributes {
  id: number;
  gameId: number;
  userId: number;
  team: number;
  lap: number;
  foPositionId?: number;
  gear: number;
  order?: number;
  ranking?: number;
  foCurveId?: number;
  stops?: number;
  techPitstopsLeft: number;
  lastPitLap: number;
  state: string;
  pitsState?: string;
  created: Date;
  modified: Date;
}

export type foCarsPk = "id";
export type foCarsId = foCars[foCarsPk];
export type foCarsOptionalAttributes = "id" | "team" | "lap" | "foPositionId" | "gear" | "order" | "ranking" | "foCurveId" | "stops" | "techPitstopsLeft" | "lastPitLap" | "state" | "pitsState" | "created" | "modified";
export type foCarsCreationAttributes = Optional<foCarsAttributes, foCarsOptionalAttributes>;

export class foCars extends Model<foCarsAttributes, foCarsCreationAttributes> implements foCarsAttributes {
  id!: number;
  gameId!: number;
  userId!: number;
  team!: number;
  lap!: number;
  foPositionId?: number;
  gear!: number;
  order?: number;
  ranking?: number;
  foCurveId?: number;
  stops?: number;
  techPitstopsLeft!: number;
  lastPitLap!: number;
  state!: string;
  pitsState?: string;
  created!: Date;
  modified!: Date;

  // foCars hasMany foDamages via foCarId
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
  // foCars hasMany foLogs via foCarId
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
  // foCars hasMany foMoveOptions via foCarId
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
  // foCars hasMany foTurns via foCarId
  foTurns!: foTurns[];
  getFoTurns!: Sequelize.HasManyGetAssociationsMixin<foTurns>;
  setFoTurns!: Sequelize.HasManySetAssociationsMixin<foTurns, foTurnsId>;
  addFoTurn!: Sequelize.HasManyAddAssociationMixin<foTurns, foTurnsId>;
  addFoTurns!: Sequelize.HasManyAddAssociationsMixin<foTurns, foTurnsId>;
  createFoTurn!: Sequelize.HasManyCreateAssociationMixin<foTurns>;
  removeFoTurn!: Sequelize.HasManyRemoveAssociationMixin<foTurns, foTurnsId>;
  removeFoTurns!: Sequelize.HasManyRemoveAssociationsMixin<foTurns, foTurnsId>;
  hasFoTurn!: Sequelize.HasManyHasAssociationMixin<foTurns, foTurnsId>;
  hasFoTurns!: Sequelize.HasManyHasAssociationsMixin<foTurns, foTurnsId>;
  countFoTurns!: Sequelize.HasManyCountAssociationsMixin;
  // foCars belongsTo foCurves via foCurveId
  foCurve!: foCurves;
  getFoCurve!: Sequelize.BelongsToGetAssociationMixin<foCurves>;
  setFoCurve!: Sequelize.BelongsToSetAssociationMixin<foCurves, foCurvesId>;
  createFoCurve!: Sequelize.BelongsToCreateAssociationMixin<foCurves>;
  // foCars belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;
  // foCars belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;
  // foCars belongsTo users via userId
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foCars {
    return foCars.init({
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
    team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Is used to match the correct pits - numbered 1-5"
    },
    lap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
      allowNull: false,
      defaultValue: -1,
      comment: "1-6 - actual gear\\n-1 - start\\n0 - is used if for any reason next turn needs to be in 1st gear"
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Player order in the current turn, when the player finished turn, it's NULL."
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    },
    techPitstopsLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'tech_pitstops_left'
    },
    lastPitLap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'last_pit_lap'
    },
    state: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      comment: "N - not ready,\r\nR - racing,\r\nX - retired,\r\nF - finished"
    },
    pitsState: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      comment: "P - in pits, L - long stop",
      field: 'pits_state'
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
    tableName: 'fo_cars',
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
        name: "game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
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
        name: "lap",
        using: "BTREE",
        fields: [
          { name: "lap" },
        ]
      },
      {
        name: "order",
        using: "BTREE",
        fields: [
          { name: "order" },
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
