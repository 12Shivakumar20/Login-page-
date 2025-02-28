const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

// Registration logic
exports.register = async (req, res) => { 
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    try {
        // Check if the email already exists in the database
        db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Database error');
            }

            if (results.length > 0) { 
                return res.render('register', {
                    message: 'That email is already in use'
                });
            }

            if (password !== passwordConfirm) {
                return res.render('register', {
                    message: 'Passwords do not match'
                });
            }

            // Hash the password
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                [name, email, hashedPassword], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send('Error registering user');
                    }

                    // Send a success message after registration
                    res.render('register', {
                        message: 'User registered successfully'
                    });
                });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

// Login logic
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if the email exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'Email or password is incorrect'
            });
        }

        // Compare the password with the stored hashed password
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render('login', {
                message: 'Email or password is incorrect'
            });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store token in cookies
        res.cookie('auth_token', token, {
            httpOnly: true, // Only accessible by the web server
            secure: process.env.NODE_ENV === 'production' // Set to true if using https
        });

        // Redirect to dashboard
        res.redirect('/dashboard');
    });
};


  


