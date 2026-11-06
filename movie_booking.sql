
CREATE DATABASE IF NOT EXISTS movie_booking;
USE movie_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(50),
    language VARCHAR(30),
    duration INT,
    release_date DATE
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    theatre_name VARCHAR(100),
    show_date DATE,
    show_time TIME,
    ticket_price DECIMAL(10,2),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    show_id INT,
    seats INT,
    total_amount DECIMAL(10,2),
    booking_status VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- Sample movies
INSERT INTO movies (title, genre, language, duration, release_date)
VALUES
('Pushpa 2', 'Action', 'Telugu', 200, '2024-12-05'),
('Kalki 2898 AD', 'Sci-Fi', 'Telugu', 181, '2024-06-27'),
('Devara', 'Action', 'Telugu', 175, '2024-09-27'),
('Inception', 'Sci-Fi', 'English', 148, '2010-07-16'),
('Interstellar', 'Adventure', 'English', 169, '2014-11-07');

-- Sample shows
INSERT INTO shows (movie_id, theatre_name, show_date, show_time, ticket_price)
VALUES
(1, 'PVR Cinemas', '2026-11-10', '10:00:00', 200.00),
(1, 'PVR Cinemas', '2026-11-10', '18:00:00', 250.00),
(2, 'INOX Cinemas', '2026-11-10', '11:00:00', 180.00),
(3, 'Asian Cinemas', '2026-11-11', '14:00:00', 220.00),
(4, 'PVR Cinemas', '2026-11-11', '19:00:00', 200.00),
(5, 'INOX Cinemas', '2026-11-12', '17:00:00', 250.00);
