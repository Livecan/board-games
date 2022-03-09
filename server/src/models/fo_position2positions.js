const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_position2positions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fo_position_from_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      }
    },
    fo_position_to_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_positions',
        key: 'id'
      }
    },
    is_left: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_straight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_right: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_curve: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_adjacent: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_equal_distance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_pitlane_move: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'fo_position2positions',
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
        name: "fo_position_from_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_from_id" },
        ]
      },
      {
        name: "fo_position_to_id",
        using: "BTREE",
        fields: [
          { name: "fo_position_to_id" },
        ]
      },
    ]
  });
};
