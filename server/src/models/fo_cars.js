const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_cars', {
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
    team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Is used to match the correct pits - numbered 1-5"
    },
    lap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
      allowNull: false,
      defaultValue: -1,
      comment: "1-6 - actual gear\\n-1 - start\\n0 - is used if for any reason next turn needs to be in 1st gear"
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Player order in the current turn, when the player finished turn, it's NULL."
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    },
    tech_pitstops_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    last_pit_lap: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    state: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      comment: "N - not ready,\r\nR - racing,\r\nX - retired,\r\nF - finished"
    },
    pits_state: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      comment: "P - in pits, L - long stop"
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
    tableName: 'fo_cars',
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
        name: "game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
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
        name: "lap",
        using: "BTREE",
        fields: [
          { name: "lap" },
        ]
      },
      {
        name: "order",
        using: "BTREE",
        fields: [
          { name: "order" },
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
