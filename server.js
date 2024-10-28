const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 8080;

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Serve static files from the project directory
app.use(express.static(path.join(__dirname, 'public'))); 
// parse json bodies
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use an environment variable for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// mysql connection setup
const getConnection = async () => {
    try {
        return await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        });
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// log in route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log('Request body:', req.body); 

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }
  
    try {
        const dbConnection = await getConnection();
        const [rows] = await dbConnection.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        // console.log('Query result:', rows);
        if (rows.length > 0) {
            // Store user data in session
            req.session.user = {
                username: username,
                created_at: rows[0].created_at
            };
            // Redirect to dashboard after successful login
            res.redirect('/dashboard.html');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Login failed');
    }
});

// Sign up route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Ensure that passwords match
    if (req.body.password !== req.body['confirm-password']) {
        return res.status(400).send('Passwords do not match.');
    }

    try {
        const dbConnection = await getConnection();
        const [result] = await dbConnection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        // console.log('User registered:', result);

        // Store user data in session
        req.session.user = {
            username: username,
            created_at: new Date() // Or fetch from database if you need to
        };
        
        // Redirect to profile after successful registration
        res.redirect('/profile.html');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Error creating user. Username may already exist.');
    }
});

// Route for profile.html
app.get('/profile.html', (req, res) => {
    // Check if user is logged in
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'), (err) => {
            if (err) {
                console.error('Error serving profile.html:', err);
                res.status(500).send('Error loading profile page.');
            }
        });
    } else {
        res.redirect('/'); // Redirect to the homepage if not logged in
    }
});

// Route for updating user password
app.post('/update', async (req, res) => {
    const { newPassword } = req.body;
    const username = req.session.user.username; // Get the logged-in user's username

    if (!newPassword) {
        return res.status(400).send('New password is required.');
    }

    try {
        const dbConnection = await getConnection();
        await dbConnection.execute(
            'UPDATE users SET password = ? WHERE username = ?',
            [newPassword, username]
        );

        res.send('Password updated successfully.');
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Failed to update password.');
    }
});

// Route for deleting user account
app.delete('/delete-account', async (req, res) => {
    const username = req.session.user.username; // Get the logged-in user's username

    try {
        const dbConnection = await getConnection();
        await dbConnection.execute(
            'DELETE FROM users WHERE username = ?',
            [username]
        );

        req.session.destroy(); // Destroy session after account deletion
        res.send('Account deleted successfully.');
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).send('Failed to delete account.');
    }
});


// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/index.html');
    });
});

// api endpoint
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('User not logged in');
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});