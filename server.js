const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const dotenv = require('dotenv').config();
const cors = require('cors');
// Import the configured passport object
const passport = require('./middleware/passport'); 
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 
            'POST, GET, PUT, PATCH, DELETE, OPTIONS'
        );
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: '*' }))
    .use("/", require("./routes/index.js"));

// Route to initiate Google authentication
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle the Google Callback
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/api-docs', session:false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

app.get('/',(req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : `Logged Out`)});


mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () =>{console.log(`Database is listening and node Running on port ${port}`)});
    }
});