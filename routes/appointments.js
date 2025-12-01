const router = require('express').Router();
const ordersController = require('../controllers/appointments');
const { orderValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', appointmentsController.getAll);
router.get('/:id', appointmentsController.getSingle);
router.post('/', isAuthenticated, appointmentValidationRules, validate, appointmentsController.createAppointment);
router.put('/:id', isAuthenticated, appointmentValidationRules, validate, appointmentsController.updateAppointment);
router.delete('/:id', isAuthenticated, appointmentsController.deleteAppointment);
module.exports = router;