const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// --- 1. GET ALL Contacts ---
const getAll = async (req, res) => {
    // #swagger.tags = ['Contacts']
    try {
        const result = await mongodb.getDatabase().db().collection('contacts').find();
        result.toArray().then((contacts) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(contacts);
        });
    } catch (error) {
        // Essential Error Handling (Rubric Point 3)
        res.status(500).json({ message: error.message || 'Error retrieving all contacts.' });
    }
};

// --- 2. GET SINGLE Contact ---
const getSingle = async (req, res) => {
    // #swagger.tags = ['Contacts']
    try {
        const contactId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId });
        result.toArray().then((contacts) => {
            if (contacts.length === 0) {
                res.status(404).json({ message: 'Contact not found.' });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(contacts[0]);
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error retrieving single contact.' });
    }
};

// --- 3. POST (CREATE) Contact ---
const createContact = async (req, res) => {
    try {
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
        
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json({ message: 'Failed to create contact.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error during creation.' });
    }
};

// --- 4. PUT (UPDATE) Contact ---
const updateContact = async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact);
        
        if (response.modifiedCount > 0) {
            res.status(204).send(); 
        } else if (response.matchedCount === 0) {
            res.status(404).json({ message: 'Contact not found for update.' });
        } else {
            res.status(200).json({ message: 'Update acknowledged, but no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error during update.' });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId });

        if (response.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(404).json({ message: 'Contact not found for deletion.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error during deletion.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};