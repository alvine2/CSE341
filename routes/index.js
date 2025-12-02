const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send(req.session.user !== undefined 
    ? `Logged in as ${req.session.user.displayName || req.session.user.username}` 
    : "Logged Out"
  );
});

router.use('/barbers', require('./barbers'));
router.use('/products', require('./products'));
router.use('/appointments', require('./appointments'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/login', (req, res) => {
  res.redirect('/auth/github');
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      res.redirect('/');
    });
  });
});

module.exports = router;
