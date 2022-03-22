import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { games, gamesId } from './games';

export interface gameTypesAttributes {
  id: number;
  name: string;
  tablePrefix: string;
  controller: string;
}

export type gameTypesPk = "id";
export type gameTypesId = gameTypes[gameTypesPk];
export type gameTypesOptionalAttributes = "id";
export type gameTypesCreationAttributes = Optional<gameTypesAttributes, gameTypesOptionalAttributes>;

export class gameTypes extends Model<gameTypesAttributes, gameTypesCreationAttributes> implements gameTypesAttributes {
  id!: number;
  name!: string;
  tablePrefix!: string;
  controller!: string;

  // gameTypes hasMany games via gameTypeId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof gameTypes {
    return gameTypes.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "name"
    },
    tablePrefix: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      unique: "table_prefix",
      field: 'table_prefix'
    },
    controller: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'game_types',
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
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "table_prefix",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "table_prefix" },
        ]
      },
    ]
  });
  }
}
