const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Crime = sequelize.define('Crime', {
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rape: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kidnap_and_assault: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dowry_deaths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assault_against_women: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assault_against_modesty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  domestic_violence: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  women_trafficking: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'crimes',
  timestamps: false,
});

Crime.getDistinctYears = async function() {
  const years = await Crime.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year']],
    raw: true,
  });
  return years.map(record => record.year);
};

module.exports = Crime;
