require('dotenv').config(); // Load .env file

const { Sequelize } = require('sequelize');

// Create a Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Username
  process.env.DB_PASSWORD,   // Password
  {
    host: process.env.DB_HOST,  // Host
    dialect: process.env.DB_DIALECT || 'mysql', // Database dialect (default to MySQL)
    port: process.env.DB_PORT || 3306           // Port number (default to 3306)
  }
);

module.exports = sequelize;