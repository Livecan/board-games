import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { drTokensGames, drTokensGamesId } from './drTokensGames';

export interface drTokensAttributes {
  id: number;
  type: number;
  value: number;
}

export type drTokensPk = "id";
export type drTokensId = drTokens[drTokensPk];
export type drTokensOptionalAttributes = "id";
export type drTokensCreationAttributes = Optional<drTokensAttributes, drTokensOptionalAttributes>;

export class drTokens extends Model<drTokensAttributes, drTokensCreationAttributes> implements drTokensAttributes {
  id!: number;
  type!: number;
  value!: number;

  // drTokens hasMany drTokensGames via drTokenId
  drTokensGames!: drTokensGames[];
  getDrTokensGames!: Sequelize.HasManyGetAssociationsMixin<drTokensGames>;
  setDrTokensGames!: Sequelize.HasManySetAssociationsMixin<drTokensGames, drTokensGamesId>;
  addDrTokensGame!: Sequelize.HasManyAddAssociationMixin<drTokensGames, drTokensGamesId>;
  addDrTokensGames!: Sequelize.HasManyAddAssociationsMixin<drTokensGames, drTokensGamesId>;
  createDrTokensGame!: Sequelize.HasManyCreateAssociationMixin<drTokensGames>;
  removeDrTokensGame!: Sequelize.HasManyRemoveAssociationMixin<drTokensGames, drTokensGamesId>;
  removeDrTokensGames!: Sequelize.HasManyRemoveAssociationsMixin<drTokensGames, drTokensGamesId>;
  hasDrTokensGame!: Sequelize.HasManyHasAssociationMixin<drTokensGames, drTokensGamesId>;
  hasDrTokensGames!: Sequelize.HasManyHasAssociationsMixin<drTokensGames, drTokensGamesId>;
  countDrTokensGames!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof drTokens {
    return drTokens.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dr_tokens',
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
