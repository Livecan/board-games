import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foCurves, foCurvesId } from './foCurves';
import type { foGames, foGamesId } from './foGames';
import type { foPositions, foPositionsId } from './foPositions';

export interface foTracksAttributes {
  id: number;
  name: string;
  pitlaneExitLength: number;
  gamePlan: string;
}

export type foTracksPk = "id";
export type foTracksId = foTracks[foTracksPk];
export type foTracksOptionalAttributes = "id" | "pitlaneExitLength";
export type foTracksCreationAttributes = Optional<foTracksAttributes, foTracksOptionalAttributes>;

export class foTracks extends Model<foTracksAttributes, foTracksCreationAttributes> implements foTracksAttributes {
  id!: number;
  name!: string;
  pitlaneExitLength!: number;
  gamePlan!: string;

  // foTracks hasMany foCurves via foTrackId
  foCurves!: foCurves[];
  getFoCurves!: Sequelize.HasManyGetAssociationsMixin<foCurves>;
  setFoCurves!: Sequelize.HasManySetAssociationsMixin<foCurves, foCurvesId>;
  addFoCurve!: Sequelize.HasManyAddAssociationMixin<foCurves, foCurvesId>;
  addFoCurves!: Sequelize.HasManyAddAssociationsMixin<foCurves, foCurvesId>;
  createFoCurve!: Sequelize.HasManyCreateAssociationMixin<foCurves>;
  removeFoCurve!: Sequelize.HasManyRemoveAssociationMixin<foCurves, foCurvesId>;
  removeFoCurves!: Sequelize.HasManyRemoveAssociationsMixin<foCurves, foCurvesId>;
  hasFoCurve!: Sequelize.HasManyHasAssociationMixin<foCurves, foCurvesId>;
  hasFoCurves!: Sequelize.HasManyHasAssociationsMixin<foCurves, foCurvesId>;
  countFoCurves!: Sequelize.HasManyCountAssociationsMixin;
  // foTracks hasMany foGames via foTrackId
  foGames!: foGames[];
  getFoGames!: Sequelize.HasManyGetAssociationsMixin<foGames>;
  setFoGames!: Sequelize.HasManySetAssociationsMixin<foGames, foGamesId>;
  addFoGame!: Sequelize.HasManyAddAssociationMixin<foGames, foGamesId>;
  addFoGames!: Sequelize.HasManyAddAssociationsMixin<foGames, foGamesId>;
  createFoGame!: Sequelize.HasManyCreateAssociationMixin<foGames>;
  removeFoGame!: Sequelize.HasManyRemoveAssociationMixin<foGames, foGamesId>;
  removeFoGames!: Sequelize.HasManyRemoveAssociationsMixin<foGames, foGamesId>;
  hasFoGame!: Sequelize.HasManyHasAssociationMixin<foGames, foGamesId>;
  hasFoGames!: Sequelize.HasManyHasAssociationsMixin<foGames, foGamesId>;
  countFoGames!: Sequelize.HasManyCountAssociationsMixin;
  // foTracks hasMany foPositions via foTrackId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof foTracks {
    return foTracks.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pitlaneExitLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'pitlane_exit_length'
    },
    gamePlan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'game_plan'
    }
  }, {
    sequelize,
    tableName: 'fo_tracks',
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
    ]
  });
  }
}
