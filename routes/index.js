const passport = require('passport');
const router = require('express').Router();

router.get('/login', passport.authenticate('github'), (req, res) => {});

// REMOVED: The /callback route handler was duplicated and is correctly defined 
// in server.js to include session setup (req.session.user = req.user;).

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
// FIX: Changing from '/' to the standard '/api-docs' path for Swagger.
// The previous error suggests require('./swagger') was not exporting a router function.
router.use('/api-docs', require('./swagger'));
router.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});
router.use('/barbers', require('./barbers'));
router.use('/products', require('./products'));
router.use('/appointments', require('./appointments'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

module.exports = router;