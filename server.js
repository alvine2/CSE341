// server.js — clean version for CSE341 project
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const mongodb = require('./data/database'); // your DB module
const routes = require('./routes/index.js'); // your routes file

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(cors());

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve swagger.json at /api-docs (make sure swagger.json is in project root or update path)
const swaggerPath = path.join(__dirname, 'swagger.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = require(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.warn('Warning: swagger.json not found at project root. /api-docs will be unavailable.');
}

// Mount app routes (should include /contacts endpoints)
app.use('/', routes);

// Simple index to show running status
app.get('/', (req, res) => {
  res.send('Contacts API — server running');
});

// Connect DB then start server
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
