// routes/index.js (UPDATED)

const passport = require('passport');
const router = require('express').Router();

// 1. GITHUB LOGIN INITIATION ROUTE
router.get('/login', passport.authenticate('github'), (req, res) => {
});

// 2. LOGOUT ROUTE
router.get('/logout', function(req, res, next) {
    // req.logout() is a Passport method to terminate the session
    req.logout(function(err) {
        if (err) { return next(err); }
        // After logout, redirect to the home page (which should show "Logged Out")
        res.redirect('/');
    });
});

// 3. API DOCUMENTATION
router.use('/', require('./swagger'));

// 4. HOME ROUTE (STATUS CHECK)
router.get('/', (req, res) => { 
    // Checks the session variable set in server.js to display login status
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
});

// 5. APPLICATION ROUTES
// These routes typically contain your protected endpoints (POST, PUT, DELETE)
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/reviews', require('./reviews'));

module.exports = router;