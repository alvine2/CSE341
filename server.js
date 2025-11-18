const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Assuming your passport configuration is correctly located at ./config/passport.js
// If your passport file is in a 'middleware' folder, change 'config' to 'middleware'.
const passport = require('./middleware/passport'); 
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

app
    .use(bodyParser.json())
    .use(session({
        secret: process.env.SESSION_SECRET || "default_secret", // Use an environment variable for security
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        // Standard headers for CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 
            'POST, GET, PUT, PATCH, DELETE, OPTIONS'
        );
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: '*' }))
    .use("/", require("./routes/index.js"));

// 🌟 1. PUBLIC ROOT ROUTE (for Grader Demonstration)
app.get('/', (req, res) => {
    // Determine login status and construct the relevant link
    const loginStatus = req.session.user 
        ? `Logged in as ${req.session.user.displayName}. <a href="/logout">Logout</a>` 
        : `Logged Out. <a href="/login">Click here to log in with Google</a>`;
        
    res.send(`
        <h1>Welcome to the CSE341 API!</h1>
        <p>This server is running on Render.</p>
        <p><strong>Status:</strong> ${loginStatus}</p>
        <p>Access the API documentation here: <a href="/api-docs">/api-docs</a></p>
        <p>To demonstrate security (401 Unauthorized), try a protected endpoint like <strong>POST /users</strong> before logging in.</p>
    `);
});

// 🌟 2. LOGIN ROUTE (Initiates OAuth)
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🌟 3. OAUTH CALLBACK ROUTE (Handles return from Google)
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/api-docs', session:false}),
    (req, res) => {
        // Upon successful authentication, store user data in session
        req.session.user = req.user;
        res.redirect('/');
    });

// 🌟 4. LOGOUT ROUTE
app.get('/logout', (req, res, next) => {
    // Passport logout function
    req.logout((err) => {
        if (err) { return next(err); }
        // Destroy the session (removes user data from the server)
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
});


// =========================================================================
// DATABASE CONNECTION
// =========================================================================

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () =>{console.log(`Database is listening and node Running on port ${port}`)});
    }
});