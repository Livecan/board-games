import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { foMoveOptions, foMoveOptionsId } from './foMoveOptions';
import type { foPositions, foPositionsId } from './foPositions';

export interface foTraversesAttributes {
  id: number;
  foMoveOptionId: number;
  foPositionId: number;
}

export type foTraversesPk = "id";
export type foTraversesId = foTraverses[foTraversesPk];
export type foTraversesOptionalAttributes = "id";
export type foTraversesCreationAttributes = Optional<foTraversesAttributes, foTraversesOptionalAttributes>;

export class foTraverses extends Model<foTraversesAttributes, foTraversesCreationAttributes> implements foTraversesAttributes {
  id!: number;
  foMoveOptionId!: number;
  foPositionId!: number;

  // foTraverses belongsTo foMoveOptions via foMoveOptionId
  foMoveOption!: foMoveOptions;
  getFoMoveOption!: Sequelize.BelongsToGetAssociationMixin<foMoveOptions>;
  setFoMoveOption!: Sequelize.BelongsToSetAssociationMixin<foMoveOptions, foMoveOptionsId>;
  createFoMoveOption!: Sequelize.BelongsToCreateAssociationMixin<foMoveOptions>;
  // foTraverses belongsTo foPositions via foPositionId
  foPosition!: foPositions;
  getFoPosition!: Sequelize.BelongsToGetAssociationMixin<foPositions>;
  setFoPosition!: Sequelize.BelongsToSetAssociationMixin<foPositions, foPositionsId>;
  createFoPosition!: Sequelize.BelongsToCreateAssociationMixin<foPositions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof foTraverses {
    return foTraverses.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    foMoveOptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_move_options',
        key: 'id'
      },
      field: 'fo_move_option_id'
    },
    foPositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      },
      field: 'fo_position_id'
    }
  }, {
    sequelize,
    tableName: 'fo_traverses',
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
        name: "fo_move_option_id",
        using: "BTREE",
        fields: [
          { name: "fo_move_option_id" },
        ]
      },
      {
        name: "fo_position_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_id" },
        ]
      },
    ]
  });
  }
}
