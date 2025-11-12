const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Reviews']
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .find();
    result.toArray().then((reviews) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews);
    });
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid review ID to find a review.');
    }
    //#swagger.tags=['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .find({ _id: reviewId });
    result.toArray().then((reviews) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews[0]);
    });
};

const createReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    const review = {
        productId: req.body.productId,
        userId: req.body.userId,
        rating: req.body.rating,
        comment: req.body.comment,
        createdAt: req.body.createdAt
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .insertOne(review);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the review');
    }
};

const updateReview = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid review ID to update a review.');
    }
    //#swagger.tags=['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const review = {
        productId: req.body.productId,
        userId: req.body.userId,
        rating: req.body.rating,
        comment: req.body.comment,
        createdAt: req.body.createdAt
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .replaceOne({ _id: reviewId }, review);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the review');
    }
};

const deleteReview = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid review ID to delete a review.');
    }

    //#swagger.tags=['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .deleteOne({ _id: reviewId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the review.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview
};

