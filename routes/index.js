const passport = require('passport');
const router = require('express').Router();
router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});
router.use('/barbers', require('./barbers'));
router.use('/products', require('./products'));
router.use('/appointments', require('./appointments'));
router.use('/reviews', require('./reviews'));
router.use('/contacts', require('./contacts'));


router.get('/login', passport.authenticate('github'), (req, res) => {
    // This function will not be called as the request will be redirected to GitHub for authentication
});

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



module.exports = router;