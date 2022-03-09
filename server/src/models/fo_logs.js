const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_logs', {
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
    lap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fo_position_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_positions',
        key: 'id'
      }
    },
    gear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roll: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    damage_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "values according to fo_damages.type"
    },
    type: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      comment: "I - initial\\nM - move\\nD - damage\\nR - repair\\nF - finish\\nP - leaving pits"
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
    tableName: 'fo_logs',
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
        name: "modified",
        using: "BTREE",
        fields: [
          { name: "modified" },
        ]
      },
      {
        name: "created",
        using: "BTREE",
        fields: [
          { name: "created" },
        ]
      },
    ]
  });
};
