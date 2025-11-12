const router = require('express').Router();
const ordersController = require('../controllers/orders');
const { orderValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

/* CRUD routes */
router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', isAuthenticated,  orderValidationRules, validate, ordersController.createOrder);
router.put('/:id',isAuthenticated,  orderValidationRules, validate, ordersController.updateOrder);
router.delete('/:id',isAuthenticated, ordersController.deleteOrder);
router.get('/products/:id', ordersController.getProductsForOrder);
router.get('/user/:userId', ordersController.getOrdersByUser);

module.exports = router;