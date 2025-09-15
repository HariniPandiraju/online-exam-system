-- Setup script for Online Exam System Database
-- Run this in MySQL before starting the Spring Boot application

-- Create database
CREATE DATABASE IF NOT EXISTS projectdb;

-- Use the database
USE projectdb;

-- Create a default teacher user (will be created by Spring Boot if not exists)
-- Tables will be auto-created by Spring Boot JPA

-- Grant privileges
GRANT ALL PRIVILEGES ON projectdb.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Show database info
SHOW DATABASES;
SELECT DATABASE();
SHOW TABLES;