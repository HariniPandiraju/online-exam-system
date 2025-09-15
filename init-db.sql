-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS projectdb;

-- Use the database
USE projectdb;

-- Grant privileges (adjust username/password as needed)
GRANT ALL PRIVILEGES ON projectdb.* TO 'root'@'localhost';
FLUSH PRIVILEGES;