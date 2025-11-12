// routes/index.js — cleaned for CSE341 project
const express = require('express');
const router = express.Router();

// Mount swagger UI route (assumes ./swagger implements it)
router.use('/', require('./swagger'));

// Simple health route / root
router.get('/', (req, res) => {
  res.send('Contacts API — server running');
});

// Mount app-specific routes
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

module.exports = router;
