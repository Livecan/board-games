const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_move_options', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fo_car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_cars',
        key: 'id'
      }
    },
    fo_position_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      }
    },
    is_next_lap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    fo_curve_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_curves',
        key: 'id'
      }
    },
    stops: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fo_move_options',
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
        name: "fo_car_id",
        using: "BTREE",
        fields: [
          { name: "fo_car_id" },
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
        name: "fo_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_curve_id" },
        ]
      },
    ]
  });
};
