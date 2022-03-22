import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface foEDamageTypesAttributes {
  id: number;
  name: string;
}

export type foEDamageTypesPk = "id";
export type foEDamageTypesId = foEDamageTypes[foEDamageTypesPk];
export type foEDamageTypesOptionalAttributes = "id";
export type foEDamageTypesCreationAttributes = Optional<foEDamageTypesAttributes, foEDamageTypesOptionalAttributes>;

export class foEDamageTypes extends Model<foEDamageTypesAttributes, foEDamageTypesCreationAttributes> implements foEDamageTypesAttributes {
  id!: number;
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof foEDamageTypes {
    return foEDamageTypes.init({
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
    tableName: 'fo_e_damage_types',
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
