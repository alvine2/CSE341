const router = require('express').Router();
const ordersController = require('../controllers/appointments');
const { orderValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', isAuthenticated, orderValidationRules, validate, ordersController.createAppointment);
router.put('/:id', isAuthenticated, orderValidationRules, validate, ordersController.updateAppointment);
router.delete('/:id', isAuthenticated, ordersController.deleteAppointment);

module.exports = router;