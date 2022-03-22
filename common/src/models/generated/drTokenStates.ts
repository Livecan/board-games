import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { drTokensGames, drTokensGamesId } from './drTokensGames';

export interface drTokenStatesAttributes {
  id: number;
  name: string;
}

export type drTokenStatesPk = "id";
export type drTokenStatesId = drTokenStates[drTokenStatesPk];
export type drTokenStatesOptionalAttributes = "id";
export type drTokenStatesCreationAttributes = Optional<drTokenStatesAttributes, drTokenStatesOptionalAttributes>;

export class drTokenStates extends Model<drTokenStatesAttributes, drTokenStatesCreationAttributes> implements drTokenStatesAttributes {
  id!: number;
  name!: string;

  // drTokenStates hasMany drTokensGames via drTokenStateId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof drTokenStates {
    return drTokenStates.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dr_token_states',
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
