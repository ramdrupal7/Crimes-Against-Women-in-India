Info
------------------------------------------------------------------------------------------------
Developed Environment   : Windows
Server                  : Nodejs
   node -v v22.6.0
   use nvm to switch to this node

Database : Mysql (relational database)
   CREATE DATABASE crimeData CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

environment variable : .env

------------------------------------------------------------------------------------------------
Command to import data (below)------------------------------------------------------------------------------------------------

# to run imports of data from csv file
# https://www.kaggle.com/datasets/balajivaraprasad/crimes-against-women-in-india-2001-2021?resource=download&select=CrimesOnWomenData.csv 

# https://www.kaggle.com/datasets/danishxr/poptable   Downloaded for Lat and long for states

Steps :
------------------------------------------------------------------------------------------------
# Project Setup Instructions ------------------------------------------------------------------------------------------------
Follow the steps below to set up and run the project:

1. **Navigate to the Project Folder**
   - Open your terminal or command prompt and change to the project directory.

2. **Open the Command Prompt (CMD)**
   - Ensure you have access to the command line interface.

3. **Install Dependencies**
   - Check if the `node_modules` directory exists. If it does not, run the following command to install the necessary dependencies:
     ```bash
     npm install
     ```

4. **Create a MySQL Database**
   - Execute the following command to create a new database:
     ```sql
     CREATE DATABASE crimeData CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

5. **Check MySQL Connection**
   - Ensure that the MySQL database connection is properly configured and that the Node.js server connects successfully.

6. **Import Data and Tables**
   - Run the following command to import data from CSV files into the database:
     ```bash
     node importCsv.js
     ```

7. **Start the Server**
   - Launch the server by executing:
     ```bash
     node app.js
     ```
   - The server will be accessible at [http://localhost:3000](http://localhost:3000).

8. Please refer to **featureDetail.docx** for additional information.