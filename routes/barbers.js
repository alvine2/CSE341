const router = require('express').Router();
const usersController = require('../controllers/barbers');
const { userValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', isAuthenticated, userValidationRules, validate, usersController.createbarbers);
router.put('/:id', isAuthenticated, userValidationRules, validate, usersController.updatebarbers);
router.delete('/:id', isAuthenticated, usersController.deletebarbers);

module.exports = router;