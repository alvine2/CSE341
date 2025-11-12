// data/database.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

let _client = null; // MongoClient instance
let _db = null;     // Db instance

const initDb = async (callback) => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || null;
    const connectionString = uri || 'mongodb://localhost:27017/contacts';

    if (typeof connectionString !== 'string' || connectionString.trim() === '') {
      throw new Error('Invalid MongoDB connection string.');
    }

    // create and connect the MongoClient
    _client = new MongoClient(connectionString);
    await _client.connect();

    // choose DB name: if the connection string specifies DB, client.db() picks it,
    // otherwise use DB_NAME env or fallback to 'contacts'
    const dbName = process.env.DB_NAME || undefined;
    _db = dbName ? _client.db(dbName) : _client.db();

    console.log('MongoDB connected to', connectionString);
    if (callback) return callback(null, _client);
    return _client;
  } catch (err) {
    console.error('Failed to initialize DB:', err.message || err);
    if (callback) return callback(err);
    throw err;
  }
};

// Return the MongoClient (legacy controllers expect this so they can call .db())
const getDatabase = () => {
  if (!_client) {
    throw new Error('MongoClient not initialized. Call initDb(callback) first.');
  }
  return _client;
};

// Return the Db instance (convenience)
const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized. Call initDb(callback) first.');
  }
  return _db;
};

const getClient = () => {
  if (!_client) {
    throw new Error('MongoClient not initialized. Call initDb(callback) first.');
  }
  return _client;
};

module.exports = {
  initDb,
  getDatabase, // returns MongoClient (so code that does getDatabase().db() works)
  getDb,       // returns Db directly
  getClient
};
