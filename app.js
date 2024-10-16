const express = require('express');
const { IndianStates, Crime } = require('./associations'); // Adjust import as necessary
const sequelize = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home route
app.get('/', async (req, res) => {
    // Fetch crime data to send to the front end for the map
    const crimeData = await IndianStates.findAll({
        include: [{
            model: Crime,
            attributes: ['year', 'rape'],
            required: false,
        }],
    });
    res.render('index', { crimeData });
});

// Individual state route
app.get('/state/:stateName', async (req, res) => {
    const stateName = req.params.stateName;
    const crimes = await Crime.findAll({ where: { state: stateName } });
    const states = await IndianStates.findAll(); // Fetch all states for the dropdown
    res.render('state', { stateName, crimes, states });
});


// API route to fetch crime data with optional year filtering
app.get('/api/crimes', async (req, res) => {
    try {
        const { year } = req.query; // Get the year from query params if available
        
        let query = `
            SELECT 
                state, 
                totalCases, 
                latitude, 
                longitude,
                total_rape, 
                total_kidnap_and_assault, 
                total_dowry_deaths, 
                total_assault_against_women, 
                total_assault_against_modesty,
                total_domestic_violence, 
                total_women_trafficking,
                total_rank 
            FROM 
                crimesummary`;

        const crimes = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });
        
        res.json(crimes);
    } catch (error) {
        console.error('Error fetching crime data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/crimes/year', async (req, res) => {
    try {
        const { year } = req.query; // Get the year from query params if available
        
        let query = `
            SELECT 
                state, 
                totalCases, 
                latitude, 
                longitude,
                total_rape, 
                total_kidnap_and_assault, 
                total_dowry_deaths, 
                total_assault_against_women, 
                total_assault_against_modesty,
                total_domestic_violence, 
                total_women_trafficking,
                total_rank 
            FROM 
                CrimeSummaryYear
        `;
        
        if (year) {
            query += ` WHERE year = :year`; // Add the year condition to the query if year is provided
        }

        query += ` order by total_rank`;

        const crimes = await sequelize.query(query, {
            replacements: year ? { year } : {}, // Replace the year placeholder if year is provided
            type: sequelize.QueryTypes.SELECT
        });
        
        res.json(crimes);
    } catch (error) {
        console.error('Error fetching crime data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/crimes/years', async (req, res) => {
    try {
        // Fetch distinct years from the Crime model
        const years = await Crime.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year']],
            raw: true
        });

        console.log(years);

        // Map the results to an array of years
        const yearList = years.map(record => record.year);
        res.json(yearList);
    } catch (error) {
        console.error('Error fetching years:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
