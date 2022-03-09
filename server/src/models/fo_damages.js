const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_damages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fo_car_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_cars',
        key: 'id'
      }
    },
    fo_move_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_move_options',
        key: 'id'
      }
    },
    fo_log_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_logs',
        key: 'id'
      }
    },
    wear_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 - Tires,\r\n2 - Gearbox,\r\n3 - Brakes,\r\n4 - Engine,\r\n5 - Chassis,\r\n6 - Shocks"
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
    tableName: 'fo_damages',
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
        name: "fo_move_option_id",
        using: "BTREE",
        fields: [
          { name: "fo_move_option_id" },
        ]
      },
      {
        name: "fo_history_id",
        using: "BTREE",
        fields: [
          { name: "fo_log_id" },
        ]
      },
      {
        name: "fo_e_damage_type_id",
        using: "BTREE",
        fields: [
          { name: "type" },
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
};
