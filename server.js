require('dotenv').config();

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
    .use(bodyParser.json())
    .use(session({
        secret: process.env.SESSION_SECRET || "a-long-random-fallback-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { 
            sameSite: 'None',
            secure: true,
        }
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true
    }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 
            'POST, GET, PUT, PATCH, DELETE, OPTIONS'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
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

app.get('/session-check', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ 
            status: 'Success', 
            user: req.session.user.displayName,
            message: 'Session is active and user is recognized.'
        });
    } else {
        res.status(401).json({ status: 'Failure', message: 'Session is NOT active.' });
    }
});

app.get('/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: true}), 
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });


mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () =>{console.log(`Database is listening and node Running on port ${port}`)});
    }
});