const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('appointment')
        .find();
    result.toArray().then((appointments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments);
    });
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid appointment ID to find an appointment.');
    }
    const appointmentId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('appointment')
        .find({ _id: appointmentId });
    result.toArray().then((appointments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments[0]);
    });
};

const createAppointment = async (req, res) => {
    const appointment = {
        userId: req.body.userId,
        productIds: req.body.productIds,
        appointmentDate: req.body.appointmentDate,
        totalAmount: req.body.totalAmount,
        status: req.body.status
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('appointment')
        .insertOne(appointment);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the appointment');
    }
};

const updateAppointment = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid appointment ID to update an appointment.');
    }
    const appointmentId = new ObjectId(req.params.id);
    const appointment = {
        userId: req.body.userId,
        productIds: req.body.productIds,
        appointmentDate: req.body.appointmentDate,
        totalAmount: req.body.totalAmount,
        status: req.body.status
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('appointment')
        .replaceOne({ _id: appointmentId }, appointment);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the appointment');
    }
};

const deleteAppointment = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid appointment ID to delete an appointment.');
    }

    const appointmentId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('appointment')
        .deleteOne({ _id: appointmentId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the appointment.');
    }
};

const getProductsForAppointment = async (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid appointment ID to find the products.');
    }
    try {
        const appointmentId = new ObjectId(req.params.id);
        const appointmentResult = await mongodb
            .getDatabase()
            .db()
            .collection('appointment')
            .findOne({ _id: appointmentId });

        if (!appointmentResult) {
            return res.status(404).json('Appointment not found.');
        }

        const productIds = appointmentResult.productIds.map(id => new ObjectId(id));
        const products = await mongodb
            .getDatabase()
            .db()
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json('Some error occurred while fetching the products for the appointment.');
    }
};

const getAppointmentByUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json('Must provide a valid user ID to find appointments.');
    }

    try {
        const appointments = await mongodb
            .getDatabase()
            .db()
            .collection('appointment')
            .find({ userId: userId })
            .toArray();

        if (appointments.length === 0) {
            return res.status(404).json('No appointments found for this user.');
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json('Some error occurred while fetching appointments for the user.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getProductsForAppointment,
    getAppointmentByUser
};