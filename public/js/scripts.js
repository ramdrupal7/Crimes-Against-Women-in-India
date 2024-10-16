// Initialize the map
const map = L.map('map').setView([20.5937, 73.9629], 3); // Coordinates for India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 7,
    minZoom: 4
}).addTo(map);

// Load available years for the dropdown
async function loadYears() {
    const yearSelect = document.getElementById('yearSelect');

    try {
        const response = await fetch(`/crimes/years`); // Fetch available years
        const years = await response.json();

        // Add 'All' option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All';
        yearSelect.appendChild(allOption);

        // Populate the year dropdown with actual years
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        // Load all data initially
        loadCrimeData('all');

        // Add an event listener to reload data when the year is changed
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            loadCrimeData(selectedYear); // Load data for the selected year
        });
    } catch (error) {
        console.error('Error loading years:', error);
    }
}

// Function to load GeoJSON data for state boundaries
async function loadStateBoundaries() {
    try {
        const response = await fetch('path/to/your/india-states.geojson'); // Fetch the GeoJSON file for Indian states
        const data = await response.json();

        // Add state boundaries to the map with a thick border
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: 'black', // Border color
                    weight: 5, // Border thickness
                    fillOpacity: 0.2, // Transparency of the inside area
                    fillColor: '#808080' // Fill color for the states
                };
            }
        }).addTo(map);
    } catch (error) {
        console.error('Error loading state boundaries:', error);
    }
}

// Function to load and display crimes on the map
async function loadCrimeData(year) {
    try {
        // Fetch crime data based on the selected year or load all data if "all" is selected
        let response;
        if (year && year !== 'all') {
            response = await fetch(`/api/crimes/year?year=${year}`); // Fetch crime data for the selected year
        } else {
            response = await fetch(`/api/crimes`); // Fetch all crime data
        }

        const data = await response.json();

        // Remove all existing markers before adding new ones
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Display each state's crime data on the map
        data.forEach(state => {
            // Determine the marker color based on total_rank
            let markerColor;
            if (state.total_rank >= 1 && state.total_rank <= 10) {
                markerColor = '#ff4c4c'; // Red for ranks 1 to 10
            } else if (state.total_rank >= 11 && state.total_rank <= 20) {
                markerColor = '#ffa500'; // Orange for ranks 11 to 20
            } else {
                markerColor = '#32cd32'; // Green for ranks 21 and above
            }

            // Create a custom icon using total_rank as the text and dynamic color
            const rankIcon = L.divIcon({
                className: 'custom-div-icon', // Optional: add class for custom styles
                html: `<div class="rank-marker" style="background-color: ${markerColor};">${state.total_rank}</div>`, // Insert total rank and set color
                iconSize: [30, 30], // Set size of the icon
                iconAnchor: [15, 15], // Set anchor point
            });

            // Add a marker for each state with the custom icon
            L.marker([state.latitude, state.longitude], { icon: rankIcon })
                .addTo(map)
                .bindPopup(` 
                    <b>${state.state}</b><br>
                    Total Cases: ${state.totalCases}<br>
                    No. Of Rape Cases : ${state.total_rape}<br>
                    Kidnapping and Abduction cases : ${state.total_kidnap_and_assault}<br>
                    Dowry Deaths : ${state.total_dowry_deaths}<br>
                    Assault against Women : ${state.total_assault_against_women}<br>
                    Assault against Modesty of Women : ${state.total_assault_against_modesty}<br>
                    Domestic Violence : ${state.total_domestic_violence}<br>
                    Women Trafficking : ${state.total_women_trafficking}<br>
                    <b >
                        <a class="btn btn-info" style="color:#fff"
                         href="/state/${state.state}" target="_blank">State View</a></b><br>
                `);
        });
    } catch (error) {
        console.error('Error fetching or displaying crime data:', error);
    }
}

// Load the state boundaries and initial data when the page loads
// loadStateBoundaries(); // Uncomment this when you have the GeoJSON path set up
loadYears(); // This will load the dropdown and default data
