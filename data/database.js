
const { MongoClient } = require('mongodb');

let _client = null; 
let _db = null;     

const initDb = async (callback) => {
  try {
    // 1. Retrieve the connection URI from environment variables
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // 2. Set the connection string with a localhost fallback
    const connectionString = uri || 'mongodb://localhost:27017/contacts';

    // 3. Robust check to ensure the connection string is valid
    if (typeof connectionString !== 'string' || connectionString.trim() === '') {
      throw new Error('FATAL ERROR: MongoDB connection string is missing or invalid. Check .env file and server.js dotenv configuration.');
    }

    // 4. Create and connect the MongoClient
    _client = new MongoClient(connectionString);
    await _client.connect();

    // 5. Choose DB name: prioritize DB_NAME env, otherwise let the URL determine it.
    const dbName = process.env.DB_NAME || undefined;
    _db = dbName ? _client.db(dbName) : _client.db();

    console.log('✅ MongoDB connected to', connectionString);
    if (callback) return callback(null, _client);
    return _client;
  } catch (err) {
    console.error('❌ Failed to initialize DB:', err.message || err);
    if (callback) return callback(err);
    throw err;
  }
};

// --- Getter Functions ---

const getDatabase = () => {
  if (!_client) {
    throw new Error('MongoClient not initialized. Call initDb(callback) first.');
  }
  return _client;
};

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
  getDatabase,
  getDb,
  getClient
};