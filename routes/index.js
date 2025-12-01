const passport = require('passport');
const router = require('express').Router();


router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next) => {  
  req.logout(err => {
    if (err) return next(err);  
    req.session.destroy(() => { 
      res.clearCookie('connect.sid', {
        path: '/', 
        httpOnly: true, 
        sameSite: 'lax'
      });    
      res.redirect('/');
    });
  });
});

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