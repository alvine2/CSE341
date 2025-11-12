const router = require('express').Router();
const usersController = require('../controllers/users');
const { userValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', isAuthenticated, userValidationRules, validate, usersController.createUser);
router.put('/:id', isAuthenticated, userValidationRules, validate, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;