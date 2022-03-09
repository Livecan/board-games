const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_games', {
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    fo_track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_tracks',
        key: 'id'
      }
    },
    cars_per_player: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Number of cars each player will get"
    },
    wear_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 21
    },
    laps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    pit_rule_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'fo_games',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
    ]
  });
};
