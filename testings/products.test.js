const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const mongodb = require('../data/database');
const { getAll } = require('../controllers/products');
const { getAll: getAllOrders } = require('../controllers/orders');
const { getAll: getAllReviews } = require('../controllers/reviews');
const { getAll: getAllUsers } = require('../controllers/users');

// Mock database connection
jest.mock('../data/database');
const mockDb = {
    collection: jest.fn().mockReturnThis(),
    find: jest.fn(),
    toArray: jest.fn()
};
mongodb.getDatabase.mockReturnValue({ db: () => mockDb });

describe('GET Endpoints', () => {
    beforeEach(() => {
        mockDb.find.mockReset();
        mockDb.toArray.mockReset();
    });

    // Products Tests
    describe('Products', () => {
        test('getAll - should fetch all products', async () => {
            const mockProducts = [{ name: 'Product1' }, { name: 'Product2' }];
            mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockProducts) });

            const req = {};
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAll(req, res);

            expect(mockDb.collection).toHaveBeenCalledWith('products');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });
    });

    // Users Tests
    describe('Users', () => {
        test('getAll - should fetch all users', async () => {
            const mockUsers = [{ userId: 'User1' }, { userId: 'User2' }];
            mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockUsers) });

            const req = {};
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllUsers(req, res);

            expect(mockDb.collection).toHaveBeenCalledWith('users');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    // Orders Tests
    describe('Orders', () => {
        test('getAll - should fetch all orders', async () => {
            const mockOrders = [{ orderId: 'Order1' }, { orderId: 'Order2' }];
            mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockOrders) });

            const req = {};
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllOrders(req, res);

            expect(mockDb.collection).toHaveBeenCalledWith('orders');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockOrders);
        });
    });

    // Reviews Tests
    describe('Reviews', () => {
        test('getAll - should fetch all reviews', async () => {
            const mockReviews = [{ reviewId: 'Review1' }, { reviewId: 'Review2' }];
            mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockReviews) });

            const req = {};
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllReviews(req, res);

            expect(mockDb.collection).toHaveBeenCalledWith('reviews');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReviews);
        });
    });
});