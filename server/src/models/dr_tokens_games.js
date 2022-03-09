const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dr_tokens_games', {
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
    dr_token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dr_tokens',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    group_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dr_token_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'dr_token_states',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'dr_tokens_games',
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
        name: "GAME_TOKEN_GAME_ID",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "GAME_TOKEN_TOKEN_ID",
        using: "BTREE",
        fields: [
          { name: "dr_token_id" },
        ]
      },
      {
        name: "PLAYER_ID",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "dr_tokens_games_ibfk_4",
        using: "BTREE",
        fields: [
          { name: "dr_token_state_id" },
        ]
      },
    ]
  });
};
