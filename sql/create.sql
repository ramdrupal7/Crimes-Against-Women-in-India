CREATE DATABASE crimeData CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use crimeData;

CREATE TABLE crime_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state VARCHAR(255),
    year INT,
    rape INT,
    kidnap_and_assault INT,
    dowry_deaths INT,
    assault_against_women INT,
    assault_against_modesty_of_women INT,
    domestic_violence INT,
    women_trafficking INT
);
