const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_positions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fo_track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fo_tracks',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fo_curve_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_curves',
        key: 'id'
      }
    },
    is_finish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    starting_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "NULL - not a starting position\r\nnumber - particular starting position"
    },
    team_pits: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pos_x: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "per 100000 width"
    },
    pos_y: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "per 100000 height"
    },
    angle: {
      type: DataTypes.DECIMAL(4,3),
      allowNull: true,
      comment: "in radians"
    },
    angle_inserted_manually: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fo_positions',
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
        name: "starting_position",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
          { name: "starting_position" },
        ]
      },
      {
        name: "fo_track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
      {
        name: "fo_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_curve_id" },
        ]
      },
      {
        name: "order",
        using: "BTREE",
        fields: [
          { name: "order" },
        ]
      },
    ]
  });
};
