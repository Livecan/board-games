import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foTracks, foTracksId } from './foTracks';
import type { games, gamesId } from './games';

export interface foGamesAttributes {
  gameId: number;
  foTrackId: number;
  carsPerPlayer: number;
  wearPoints: number;
  laps: number;
  pitRuleId?: number;
  created: Date;
}

export type foGamesPk = "gameId";
export type foGamesId = foGames[foGamesPk];
export type foGamesOptionalAttributes = "carsPerPlayer" | "wearPoints" | "laps" | "pitRuleId" | "created";
export type foGamesCreationAttributes = Optional<foGamesAttributes, foGamesOptionalAttributes>;

export class foGames extends Model<foGamesAttributes, foGamesCreationAttributes> implements foGamesAttributes {
  gameId!: number;
  foTrackId!: number;
  carsPerPlayer!: number;
  wearPoints!: number;
  laps!: number;
  pitRuleId?: number;
  created!: Date;

  // foGames belongsTo foTracks via foTrackId
  foTrack!: foTracks;
  getFoTrack!: Sequelize.BelongsToGetAssociationMixin<foTracks>;
  setFoTrack!: Sequelize.BelongsToSetAssociationMixin<foTracks, foTracksId>;
  createFoTrack!: Sequelize.BelongsToCreateAssociationMixin<foTracks>;
  // foGames belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foGames {
    return foGames.init({
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'games',
        key: 'id'
      },
      field: 'game_id'
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
    carsPerPlayer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Number of cars each player will get",
      field: 'cars_per_player'
    },
    wearPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 21,
      field: 'wear_points'
    },
    laps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    pitRuleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pit_rule_id'
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'fo_games',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
    ]
  });
  }
}
