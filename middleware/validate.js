const { body, validationResult } = require('express-validator');

const productValidationRules = [
// Validate and sanitize fields for the 'products' collection.
    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .trim()
        .escape(),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .trim()
        .escape(),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim()
        .escape(),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a number greater than 0'),
    body('stockQuantity')
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer'),
    body('brand')
        .notEmpty()
        .withMessage('Brand is required')
        .trim()
        .escape(),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be a number between 0 and 5'),
    body('dateAdded')
        .notEmpty()
        .withMessage('Date added is required')
        .trim()
        .escape(),
    body('isAvailable')
        .isBoolean()
        .withMessage('Availability must be true or false'),
    ];

const userValidationRules = [
// Validate and sanitize fields for the 'users' collection.
    body('firstName')
    .notEmpty()
        .withMessage('Seller firstName is required')
        .trim()
        .escape(),
    body('lastName')
        .notEmpty()
        .withMessage('Seller lastName is required')
        .trim()
        .escape(),
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('address')
        .notEmpty()
        .withMessage('Address is required'),
    body('createdAt')
        .notEmpty()
        .withMessage('A data is required')
        .trim()
        .escape(),
    ]

const reviewValidationRules = [
// Validate and sanitize fields for the 'reviews' collection.
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .trim()
        .escape(),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .trim()
        .escape(),
    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .notEmpty()
        .withMessage('Comment is required')
        .trim()
        .escape(),
    body('createdAt')
        .notEmpty()
        .withMessage('A data is required')
        .trim()
        .escape(),
    ]
const orderValidationRules = [
    // Validate and sanitize fields for the 'orders' collection.
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID'),
    body('productIds')
        .isArray({ min: 1 })
        .withMessage('Product IDs must be a non-empty array')
     //   .custom((value) => value.isMongoId())
    //  .withMessage('Each product ID must be valid')
    ,
    body('orderDate')
        .isISO8601()
        .withMessage('Order date must be a valid date in ISO 8601 format'),
    body('totalAmount')
        .isFloat({ gt: 0 })
        .withMessage('Total amount must be a positive number'),
    body('status')
        .isIn(['Pending', 'Completed', 'Delivered', 'Cancelled'])
        .withMessage('Status must be one of the following: pending, shipped, delivered, cancelled')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    productValidationRules,
    userValidationRules,
    reviewValidationRules,
    orderValidationRules,
    validate
};