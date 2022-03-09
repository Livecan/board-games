const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('games', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    min_players: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    game_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'game_states',
        key: 'id'
      }
    },
    game_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'game_types',
        key: 'id'
      }
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
    tableName: 'games',
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
        name: "game_state_id",
        using: "BTREE",
        fields: [
          { name: "game_state_id" },
        ]
      },
      {
        name: "creator_id",
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
      {
        name: "game_type_id",
        using: "BTREE",
        fields: [
          { name: "game_type_id" },
        ]
      },
    ]
  });
};
