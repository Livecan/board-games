const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dr_turns', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roll: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    returning: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    taking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    dropping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    oxygen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
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
    tableName: 'dr_turns',
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
        name: "Game_ID",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "Player_ID",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
