const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fo_curves', {
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
    fo_next_curve_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fo_curves',
        key: 'id'
      }
    },
    stops: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fo_curves',
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
        name: "track_id",
        using: "BTREE",
        fields: [
          { name: "fo_track_id" },
        ]
      },
      {
        name: "next_curve_id",
        using: "BTREE",
        fields: [
          { name: "fo_next_curve_id" },
        ]
      },
    ]
  });
};
