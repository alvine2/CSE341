const passport = require('passport');
const router = require('express').Router();

router.get('/login', passport.authenticate('github'), (req, res) => {});


router.get('/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Upon successful authentication, redirect the user to the home page.
        res.redirect('/');
    }
);
// --- END: ADDED CALLBACK HANDLER ---

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});
router.use('/barbers', require('./barbers'));
router.use('/products', require('./products'));
router.use('/appointments', require('./appointments'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

module.exports = router;