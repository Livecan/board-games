const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_traverses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fo_move_option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_move_options',
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
};
