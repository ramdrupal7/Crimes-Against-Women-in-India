const fs = require('fs');
const csv = require('csv-parser');
const IndianStates = require('./models/IndianStates'); // Import the IndianStates model
const Crime = require('./models/Crime'); // Import the Crime model
const sequelize = require('./config/database');

// Function to drop tables if they exist
const dropTables = async () => {
  try {
    await sequelize.query("DROP TABLE IF EXISTS `crimes`");
    await sequelize.query("DROP TABLE IF EXISTS `IndianStates`");
    console.log('Existing tables dropped');
  } catch (err) {
    console.error('Error dropping tables:', err.message);
    throw err; // Handle errors accordingly
  }
};

// Function to create tables if they don't exist
const createTables = async () => {
  try {
    await IndianStates.sync(); // Create IndianStates table
    console.log('IndianStates table created or already exists');

    await Crime.sync(); // Create Crimes table
    console.log('Crimes table created or already exists');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw err; // Handle errors accordingly
  }
};

const createCrimeSummaryYearView = async () => {
  try {
    await sequelize.query(`
      CREATE OR REPLACE VIEW CrimeSummaryYear AS
    WITH RankedCrimes AS (
        SELECT 
            crimes.state,
            crimes.year,
            SUM(crimes.rape + crimes.kidnap_and_assault + crimes.dowry_deaths + 
                crimes.assault_against_women + crimes.assault_against_modesty + 
                crimes.domestic_violence + crimes.women_trafficking) AS totalCases,
            RANK() OVER (PARTITION BY crimes.year ORDER BY 
                SUM(crimes.rape + crimes.kidnap_and_assault + crimes.dowry_deaths + 
                    crimes.assault_against_women + crimes.assault_against_modesty + 
                    crimes.domestic_violence + crimes.women_trafficking) DESC) AS total_rank
        FROM 
            crimes
        GROUP BY 
            crimes.state, crimes.year
    )
    SELECT 
        RankedCrimes.state,
        RankedCrimes.year,
        RankedCrimes.totalCases,
        RankedCrimes.total_rank,
        indianstates.latitude,
        indianstates.longitude,
        SUM(crimes.rape) AS total_rape, 
        SUM(crimes.kidnap_and_assault) AS total_kidnap_and_assault, 
        SUM(crimes.dowry_deaths) AS total_dowry_deaths, 
        SUM(crimes.assault_against_women) AS total_assault_against_women, 
        SUM(crimes.assault_against_modesty) AS total_assault_against_modesty, 
        SUM(crimes.domestic_violence) AS total_domestic_violence, 
        SUM(crimes.women_trafficking) AS total_women_trafficking
    FROM 
        RankedCrimes
    LEFT JOIN 
        crimes ON RankedCrimes.state = crimes.state AND RankedCrimes.year = crimes.year
    LEFT JOIN 
        indianstates ON crimes.state = indianstates.stateName
    GROUP BY 
        RankedCrimes.state, RankedCrimes.year, indianstates.latitude, indianstates.longitude, RankedCrimes.total_rank
    ORDER BY 
        RankedCrimes.year, RankedCrimes.total_rank;
    `);
    console.log('CrimeSummary view with rank created successfully');
  } catch (err) {
    console.error('Error creating CrimeSummary view:', err.message);
    throw err; // Handle errors accordingly
  }
};


const createCrimeSummaryView = async () => {
  try {
    await sequelize.query(`
      CREATE OR REPLACE VIEW CrimeSummary AS
        WITH RankedCrimes AS (
            SELECT 
                crimes.state,
                crimes.year,
                SUM(crimes.rape + crimes.kidnap_and_assault + crimes.dowry_deaths + 
                    crimes.assault_against_women + crimes.assault_against_modesty + 
                    crimes.domestic_violence + crimes.women_trafficking) AS totalCases,
                RANK() OVER (PARTITION BY crimes.year ORDER BY 
                    SUM(crimes.rape + crimes.kidnap_and_assault + crimes.dowry_deaths + 
                        crimes.assault_against_women + crimes.assault_against_modesty + 
                        crimes.domestic_violence + crimes.women_trafficking) DESC) AS total_rank
            FROM 
                crimes
            GROUP BY 
                crimes.state, crimes.year
        )
        SELECT 
            RankedCrimes.state,
            RankedCrimes.year,
            RankedCrimes.totalCases,
            RankedCrimes.total_rank,
            indianstates.latitude,
            indianstates.longitude,
            SUM(crimes.rape) AS total_rape, 
            SUM(crimes.kidnap_and_assault) AS total_kidnap_and_assault, 
            SUM(crimes.dowry_deaths) AS total_dowry_deaths, 
            SUM(crimes.assault_against_women) AS total_assault_against_women, 
            SUM(crimes.assault_against_modesty) AS total_assault_against_modesty, 
            SUM(crimes.domestic_violence) AS total_domestic_violence, 
            SUM(crimes.women_trafficking) AS total_women_trafficking
        FROM 
            RankedCrimes
        LEFT JOIN 
            crimes ON RankedCrimes.state = crimes.state AND RankedCrimes.year = crimes.year
        LEFT JOIN 
            indianstates ON crimes.state = indianstates.stateName
        GROUP BY 
            RankedCrimes.state
        ORDER BY 
            RankedCrimes.year, RankedCrimes.total_rank;
    `);
    console.log('CrimeSummary view with rank created successfully');
  } catch (err) {
    console.error('Error creating CrimeSummary view:', err.message);
    throw err; // Handle errors accordingly
  }
};

// Function to insert IndianStates data from CSV
const insertIndianStatesData = async (csvFilePath) => {
  const insertPromises = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        insertPromises.push(IndianStates.create({
          stateName: row['State.Name'].trim(), // Trimmed whitespace
          latitude: parseFloat(row['latitude'].trim()), // Trimmed and parsed
          longitude: parseFloat(row['longitude'].trim()) // Trimmed and parsed
        }));
      })
      .on('end', async () => {
        console.log('IndianStates CSV file successfully processed');
        await Promise.all(insertPromises);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error reading IndianStates CSV file:', err.message);
        reject(err);
      });
  });
};

// Function to insert Crimes data from CSV
const insertCrimeData = async (csvFilePath) => {
  const insertPromises = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const state = row['State'].trim(); // Trimmed whitespace
        insertPromises.push(
          Crime.create({
            state: state,
            year: row['Year'].trim(), // Trimmed
            rape: parseInt(row['Rape'].trim(), 10), // Trimmed and parsed
            kidnap_and_assault: parseInt(row['K&A'].trim(), 10), // Trimmed and parsed
            dowry_deaths: parseInt(row['DD'].trim(), 10), // Trimmed and parsed
            assault_against_women: parseInt(row['AoW'].trim(), 10), // Trimmed and parsed
            assault_against_modesty: parseInt(row['AoM'].trim(), 10), // Trimmed and parsed
            domestic_violence: parseInt(row['DV'].trim(), 10), // Trimmed and parsed
            women_trafficking: parseInt(row['WT'].trim(), 10) // Trimmed and parsed
          }).catch((err) => {
            console.error(`Failed to insert crime data for state: ${state}`, err.message);
          })
        );
      })
      .on('end', async () => {
        console.log('Crimes CSV file successfully processed');
        await Promise.all(insertPromises);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error reading Crimes CSV file:', err.message);
        reject(err);
      });
  });
};

// Main function to run the import process
const importCSV = async () => {
  const indianStatesCsvFilePath = 'data/IndianStatesData.csv'; // Path for IndianStates CSV
  const crimesCsvFilePath = 'data/CrimesOnWomenData.csv'; // Path for Crimes CSV

  try {
    await dropTables(); // Drop existing tables
    await createTables(); // Create new tables

    // First, insert IndianStates data
    await insertIndianStatesData(indianStatesCsvFilePath);

    // Then, insert Crimes data
    await insertCrimeData(crimesCsvFilePath);

    await createCrimeSummaryView();
    await createCrimeSummaryYearView();

    console.log('All data imported successfully');

    // Close the Sequelize connection when done
    await sequelize.close();
    console.log('Sequelize connection closed');
  } catch (err) {
    console.error('Error during import process:', err.message);
    await sequelize.close();
  }
};

// Execute the import function
importCSV();