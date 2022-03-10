import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { games, gamesId } from './games';

export interface gameStatesAttributes {
  id: number;
  name: string;
}

export type gameStatesPk = "id";
export type gameStatesId = gameStates[gameStatesPk];
export type gameStatesOptionalAttributes = "id";
export type gameStatesCreationAttributes = Optional<gameStatesAttributes, gameStatesOptionalAttributes>;

export class gameStates extends Model<gameStatesAttributes, gameStatesCreationAttributes> implements gameStatesAttributes {
  id!: number;
  name!: string;

  // gameStates hasMany games via gameStateId
  games!: games[];
  getGames!: Sequelize.HasManyGetAssociationsMixin<games>;
  setGames!: Sequelize.HasManySetAssociationsMixin<games, gamesId>;
  addGame!: Sequelize.HasManyAddAssociationMixin<games, gamesId>;
  addGames!: Sequelize.HasManyAddAssociationsMixin<games, gamesId>;
  createGame!: Sequelize.HasManyCreateAssociationMixin<games>;
  removeGame!: Sequelize.HasManyRemoveAssociationMixin<games, gamesId>;
  removeGames!: Sequelize.HasManyRemoveAssociationsMixin<games, gamesId>;
  hasGame!: Sequelize.HasManyHasAssociationMixin<games, gamesId>;
  hasGames!: Sequelize.HasManyHasAssociationsMixin<games, gamesId>;
  countGames!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof gameStates {
    return gameStates.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'game_states',
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
