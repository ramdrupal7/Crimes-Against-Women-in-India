const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IndianStates = sequelize.define('IndianStates', {
  stateName: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'IndianStates',
  timestamps: false,
});

module.exports = IndianStates;
