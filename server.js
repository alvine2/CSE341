require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

const mongodb = require('./data/database');
const routes = require('./routes/index.js');

require('./middleware/passport');

const app = express();
const port = process.env.PORT || 4000;

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

// --- 🔑 UNPROTECTED ROUTES (Must be defined first) ---

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }) 
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/api-docs'); 
    }
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// 🔑 Root route is defined here to ensure it's hit before the protected router.
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('<h1>Contacts API Running</h1><p>You are logged in.</p><p><a href="/api-docs">Go to Protected API Docs</a> | <a href="/logout">Logout</a></p>');
    } else {
        res.send('<h1>Contacts API Running</h1><p>You must <a href="/auth/google">Login with Google</a> to access the API documentation.</p>');
    }
});

// --- Swagger Documentation (Protected) ---

const swaggerPath = path.join(__dirname, 'swagger.json');
if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = require(swaggerPath);
    
    const swaggerOptions = {
        requestInterceptor: (req) => {
            req.credentials = 'include';
            return req;
        }
    };

    app.use('/api-docs', isAuthenticated, swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
} else {
    console.warn('Warning: swagger.json not found at project root. /api-docs will be unavailable.');
}

// --- 🔑 PROTECTED ROUTER (Must be defined after '/') ---
// This applies isAuthenticated to all routes in routes/index.js
app.use('/', isAuthenticated, routes); 

// --- Database Connection ---
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize DB:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
            console.log('Swagger UI available at /api-docs (if swagger.json present)');
        });
    }
});