const passport = require('passport');
const router = require('express').Router();

// your other sub-routes
router.use('/', require('./swagger')); // keep if you want /swagger as sub-route
router.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName || req.session.user.username}` : "Logged Out");
});
router.use('/barbers', require('./barbers'));
router.use('/products', require('./products'));
router.use('/appointments', require('./appointments'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

// Start GitHub auth
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Note: the callback route is handled in server.js at /auth/github/callback
// If you prefer the callback to be here instead, move the callback handler to this file.

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
      res.redirect('/');
    });
  });
});

module.exports = router;
