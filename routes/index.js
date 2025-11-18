// routes/index.js — cleaned for CSE341 project
const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send('Contacts API — server running');
});

router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

module.exports = router;
