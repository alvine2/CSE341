const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['barbers']
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('barbers')
        .find();
    result.toArray().then((barbers) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(barbers);
    });
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid barbers ID to find a barbers.');
    }
    //#swagger.tags=['barbers']
    const barbersId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('barbers')
        .find({ _id: barbersId });
    result.toArray().then((barbers) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(barbers[0]);
    });
};

const createbarbers = async (req, res) => {
    //#swagger.tags=['barbers']
    const barbers = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        address: req.body.address,
        createdAt: req.body.createdAt
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('barbers')
        .insertOne(barbers);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the barbers');
    }
};

const updatebarbers = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid barbers ID to update a barbers.');
    }
    //#swagger.tags=['barbers']
    const barbersId = new ObjectId(req.params.id);
    const barbers = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        address: req.body.address,
        createdAt: req.body.createdAt
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('barbers')
        .replaceOne({ _id: barbersId }, barbers);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the barbers');
    }
};

const deletebarbers = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid barbers ID to delete a barbers.');
    }

    //#swagger.tags=['barbers']
    const barbersId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('barbers')
        .deleteOne({ _id: barbersId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the barbers.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createbarbers, // <-- Notice the name here
    updatebarbers,
    deletebarbers
};