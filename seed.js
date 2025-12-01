// seed.js
require('dotenv').config(); // load .env early
const mongodb = require('./data/database');
const fs = require('fs');
const path = require('path');

console.log('MONGO_URI from env:', process.env.MONGO_URI);

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filePath} not found. Skipping.`);
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error parsing JSON from ${filePath}:`, err.message);
    return null;
  }
}

mongodb.initDb(async (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  try {
    const db = mongodb.getDatabase().db();

    // ---- Contacts ----
    const contactsFile = path.join(__dirname, 'contacts.json');
    const contactsData = readJsonIfExists(contactsFile);
    if (Array.isArray(contactsData) && contactsData.length > 0) {
      const contactsCount = await db.collection('contacts').countDocuments();
      if (contactsCount > 0) {
        console.log(`Contacts collection already has ${contactsCount} records. Skipping insert.`);
      } else {
        const res = await db.collection('contacts').insertMany(contactsData);
        console.log(`Successfully inserted ${res.insertedCount} contacts`);
      }
    }

    // ---- Appointments (was users previously) ----
    const appointmentsFile = path.join(__dirname, 'appointments.json');
    const appointmentsData = readJsonIfExists(appointmentsFile);
    if (Array.isArray(appointmentsData) && appointmentsData.length > 0) {
      const apptCount = await db.collection('appointments').countDocuments();
      if (apptCount > 0) {
        console.log(`Appointments collection already has ${apptCount} records. Skipping insert.`);
      } else {
        const res = await db.collection('appointments').insertMany(appointmentsData);
        console.log(`Successfully inserted ${res.insertedCount} appointments`);
      }
    }

    // ---- Barbers ----
    const barbersFile = path.join(__dirname, 'barbers.json');
    const barbersData = readJsonIfExists(barbersFile);
    if (Array.isArray(barbersData) && barbersData.length > 0) {
      const barbersCount = await db.collection('barbers').countDocuments();
      if (barbersCount > 0) {
        console.log(`Barbers collection already has ${barbersCount} records. Skipping insert.`);
      } else {
        const res = await db.collection('barbers').insertMany(barbersData);
        console.log(`Successfully inserted ${res.insertedCount} barbers`);
      }
    }

    // ---- Products ----
    const productsFile = path.join(__dirname, 'products.json');
    const productsData = readJsonIfExists(productsFile);
    if (Array.isArray(productsData) && productsData.length > 0) {
      const productsCount = await db.collection('products').countDocuments();
      if (productsCount > 0) {
        console.log(`Products collection already has ${productsCount} records. Skipping insert.`);
      } else {
        const res = await db.collection('products').insertMany(productsData);
        console.log(`Successfully inserted ${res.insertedCount} products`);
      }
    }

    console.log('Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
});
