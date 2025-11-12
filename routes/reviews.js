const router = require('express').Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);
router.post('/', isAuthenticated, reviewValidationRules, validate, reviewsController.createReview);
router.put('/:id', isAuthenticated,reviewValidationRules, validate, reviewsController.updateReview);
router.delete('/:id',isAuthenticated, reviewsController.deleteReview);

module.exports = router;