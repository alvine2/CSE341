require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    }
  })
);

// ---------------------------------------------
// PASSPORT CONFIG
// ---------------------------------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "https://cse341-9e5j.onrender.com/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// ---------------------------------------------
// LOGIN ROUTES
// ---------------------------------------------

// FIXED: Missing login endpoint
app.get("/login", (req, res) => {
  res.redirect("/auth/github");
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login-failed",
    session: true
  }),
  (req, res) => {
    req.session.user = {
      id: req.user.id,
      displayName: req.user.displayName || req.user.username,
      username: req.user.username,
      photos: req.user.photos || []
    };
    res.redirect("/");
  }
);

// ---------------------------------------------
app.get("/login-failed", (req, res) => {
  res.status(401).send("GitHub login failed. Try again.");
});

// ---------------------------------------------

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use("/", require("./routes/index.js"));

app.get("/session-check", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      status: "Success",
      user: req.session.user.displayName,
      message: "Session active."
    });
  }
  res.status(401).json({ status: "Failure", message: "No active session." });
});

// ---------------------------------------------
mongodb.initDb((err) => {
  if (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
