

const routes = require('express').Router();
const contactsController = require('../controllers/contacts');
const auth = require('../middleware/authenticate');
const validation = require('../middleware/validate');

routes.get('/', contactsController.getAll);

routes.post('/', 
    auth.isAuthenticated,
    validation.validate, 
    contactsController.createContact
);

routes.put('/:id', 
    auth.isAuthenticated, 
    validation.validate, 
    contactsController.updateContact
);

routes.delete('/:id', 
    auth.isAuthenticated,
    contactsController.deleteContact
);

module.exports = routes;