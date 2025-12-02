require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

// --- NEW IMPORTS FOR SWAGGER/API DOCS ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Make sure this file exists!
// ----------------------------------------

const port = process.env.PORT || 3000;
const app = express();

// If app is behind a proxy (Heroku/Render), enable trust proxy for secure cookies
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app
  // --- NEW SWAGGER UI CONFIGURATION ---
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  // ------------------------------------
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(session({
    secret: process.env.SESSION_SECRET || "a-long-random-fallback-secret-key",
    resave: false,
    saveUninitialized: false, // recommended: only save session if something is stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false, // secure cookie only in production (HTTPS)
      httpOnly: true
    }
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(cors({
    origin: true, // allow origin dynamically (adjust to specific origin in production)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }))
  .use("/", require("./routes/index.js"));

// ---------- Passport / GitHub strategy ----------
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // make sure this matches the callback you set in your GitHub OAuth app
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // You can lookup/create user in DB here. For now we pass the profile through.
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  // Consider serializing only user id if you store users in DB
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // If you serialized only an id, fetch user record here.
  done(null, user);
});
// -----------------------------------------------

// Optional session-check route
app.get('/session-check', (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      status: 'Success',
      user: req.session.user.displayName || req.session.user.username,
      message: 'Session is active and user is recognized.'
    });
  } else {
    res.status(401).json({ status: 'Failure', message: 'Session is NOT active.' });
  }
});

// Auth callback route (GitHub will redirect here)
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failed', session: true }),
  (req, res) => {
    // Successful authentication.
    // Save minimal user details to session for your app to use.
    req.session.user = {
      id: req.user.id,
      displayName: req.user.displayName || req.user.username,
      username: req.user.username,
      photos: req.user.photos || []
    };
    res.redirect('/');
  }
);

// Optional simple failure route
app.get('/login-failed', (req, res) => {
  res.status(401).send('GitHub login failed. Please try again.');
});

// Initialize DB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Database initialized and Node running on port ${port}`);
    });
  }
});
