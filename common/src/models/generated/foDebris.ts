import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foPositions, foPositionsId } from './foPositions';
import type { games, gamesId } from './games';

export interface foDebrisAttributes {
  id: number;
  gameId: number;
  foPositionId: number;
  created: Date;
  modified: Date;
}

export type foDebrisPk = "id";
export type foDebrisId = foDebris[foDebrisPk];
export type foDebrisOptionalAttributes = "id" | "created" | "modified";
export type foDebrisCreationAttributes = Optional<foDebrisAttributes, foDebrisOptionalAttributes>;

export class foDebris extends Model<foDebrisAttributes, foDebrisCreationAttributes> implements foDebrisAttributes {
  id!: number;
  gameId!: number;
  foPositionId!: number;
  created!: Date;
  modified!: Date;

  // foDebris belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;
  // foDebris belongsTo games via gameId
  game!: games;
  getGame!: Sequelize.BelongsToGetAssociationMixin<games>;
  setGame!: Sequelize.BelongsToSetAssociationMixin<games, gamesId>;
  createGame!: Sequelize.BelongsToCreateAssociationMixin<games>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foDebris {
    return foDebris.init({
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
    foPositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'fo_debris',
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
        name: "fo_position_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_id" },
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
    ]
  });
  }
}
