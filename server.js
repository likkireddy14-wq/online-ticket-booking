
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend files
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root',
    database: 'movie_booking'
});

// Database connection
db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err.message);
        return;
    }

    console.log('MySQL Database Connected Successfully!');
});

// Test API
app.get('/api/test', (req, res) => {
    res.send('Online Movie Booking System Backend is Working!');
});

// Get all movies
app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Unable to fetch movies'
            });
        }

        res.json(results);
    });
});

// Get all shows
app.get('/api/shows', (req, res) => {
    const sql = `
        SELECT
            shows.show_id,
            movies.title,
            shows.theatre_name,
            shows.show_date,
            shows.show_time,
            shows.ticket_price
        FROM shows
        JOIN movies ON shows.movie_id = movies.movie_id
        ORDER BY shows.show_date, shows.show_time
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Unable to fetch shows'
            });
        }

        res.json(results);
    });
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
    const { name, email, show_id, seats } = req.body;

    if (
        !name ||
        !email ||
        !show_id ||
        !Number.isInteger(seats) ||
        seats < 1 ||
        seats > 10
    ) {
        return res.status(400).json({
            message: 'Please enter valid booking details.'
        });
    }

    db.query(
        'SELECT ticket_price FROM shows WHERE show_id = ?',
        [show_id],
        (err, showResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Database error.'
                });
            }

            if (showResults.length === 0) {
                return res.status(404).json({
                    message: 'Show not found.'
                });
            }

            const totalAmount =
                Number(showResults[0].ticket_price) * seats;

            db.query(
                'SELECT user_id FROM users WHERE email = ?',
                [email],
                (err, userResults) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Database error.'
                        });
                    }

                    function saveBooking(userId) {
                        db.query(
                            `INSERT INTO bookings
                            (user_id, show_id, seats, total_amount, booking_status)
                            VALUES (?, ?, ?, ?, ?)`,
                            [
                                userId,
                                show_id,
                                seats,
                                totalAmount,
                                'Confirmed'
                            ],
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        message: 'Unable to save booking.'
                                    });
                                }

                                res.status(201).json({
                                    message: 'Booking successful!',
                                    booking_id: result.insertId,
                                    total_amount: totalAmount
                                });
                            }
                        );
                    }

                    if (userResults.length > 0) {
                        saveBooking(userResults[0].user_id);
                    } else {
                        const temporaryPassword =
                            crypto.randomBytes(32).toString('hex');

                        db.query(
                            `INSERT INTO users (name, email, password)
                            VALUES (?, ?, ?)`,
                            [name, email, temporaryPassword],
                            (err, userResult) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        message: 'Unable to create customer.'
                                    });
                                }

                                saveBooking(userResult.insertId);
                            }
                        );
                    }
                }
            );
        }
    );
});

// Get bookings using customer email
app.get('/api/bookings', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({
            message: 'Please enter your email.'
        });
    }

    const sql = `
        SELECT
            bookings.booking_id,
            movies.title,
            shows.theatre_name,
            shows.show_date,
            shows.show_time,
            bookings.seats,
            bookings.total_amount,
            bookings.booking_status
        FROM bookings
        JOIN users ON bookings.user_id = users.user_id
        JOIN shows ON bookings.show_id = shows.show_id
        JOIN movies ON shows.movie_id = movies.movie_id
        WHERE users.email = ?
        ORDER BY bookings.booking_id DESC
    `;

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Unable to fetch bookings.'
            });
        }

        res.json(results);
    });
});

// Home page
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
