const router = require('express').Router();
const appointmentsController = require('../controllers/appointments');
const { appointmentValidationRules, validate } = require('../middleware/validate'); 
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', appointmentsController.getAll);
router.get('/:id', appointmentsController.getSingle);
router.post('/', isAuthenticated,  appointmentsController.createAppointment);
router.put('/:id', isAuthenticated,  appointmentsController.updateAppointment); 
router.delete('/:id', isAuthenticated, appointmentsController.deleteAppointment);

module.exports = router;