// server.js (UPDATED FOR RENDER DEPLOYMENT)

require('dotenv').config(); // MUST BE THE FIRST LINE

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const port = process.env.PORT || 3000;
const app = express();

app
    // -----------------------------------------------------------------
    // 🚨 FIX 1: SESSION CONFIGURATION FOR HTTPS DEPLOYMENT
    // We use SESSION_SECRET from the environment and set secure/sameSite for Render.
    // -----------------------------------------------------------------
    .use(bodyParser.json())
    .use(session({
        secret: process.env.SESSION_SECRET || "a-long-random-fallback-secret-key", // 🚨 Use ENV variable!
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: true,   // MUST BE TRUE for HTTPS (Render)
            sameSite: 'None' // Allows cookie to be sent cross-domain
        }
    }))
    .use(passport.initialize())
    .use(passport.session())
    
    // -----------------------------------------------------------------
    // FIX 2: CONSOLIDATED AND CORRECT CORS CONFIGURATION
    // Credentials: true allows the browser to send the session cookie back.
    // -----------------------------------------------------------------
    .use(cors({
        origin: '*', // Allows access from any origin
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true // 🚨 CRITICAL: Allows browser to send session cookie
    }))
    .use((req, res, next) => {
        // Redundant Access-Control headers are now generally handled by the cors() middleware above, 
        // but kept here for fallback, using the secure headers.
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 
            'POST, GET, PUT, PATCH, DELETE, OPTIONS'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // Required with credentials: true
        next();
    })
    .use("/", require("./routes/index.js"));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/',(req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : `Logged Out`)});

// -----------------------------------------------------------------
// 🚨 FIX 3: PASSPORT CALLBACK SESSION FLAG
// MUST be true to allow Passport to manage the user session.
// -----------------------------------------------------------------
app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: true}), // 🚨 Changed to session: true
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });
// -----------------------------------------------------------------


mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () =>{console.log(`Database is listening and node Running on port ${port}`)});
    }
});