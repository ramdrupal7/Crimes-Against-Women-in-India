const IndianStates = require('./models/IndianStates');
const Crime = require('./models/Crime');

IndianStates.hasMany(Crime, {
  foreignKey: 'state',
  sourceKey: 'stateName',
});

module.exports = { IndianStates, Crime };