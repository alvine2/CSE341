const mongodb = require('./data/database');
const fs = require('fs');
const path = require('path');

mongodb.initDb(async (err) => {
    if (err) {
        console.log('Database connection failed:', err);
        process.exit(1);
    }

    try {
        const db = mongodb.getDatabase().db();
        
        const contactsPath = path.join(__dirname, 'contacts.json');
        const contactsData = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
        
        const existingCount = await db.collection('contacts').countDocuments();
        if (existingCount > 0) {
            console.log(`Contacts collection already has ${existingCount} records. Skipping insert.`);
        } else {
            const result = await db.collection('contacts').insertMany(contactsData);
            console.log(`Successfully inserted ${result.insertedCount} contacts`);
        }

        const usersPath = path.join(__dirname, 'users.json');
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        
        const userCount = await db.collection('users').countDocuments();
        if (userCount > 0) {
            console.log(`Users collection already has ${userCount} records. Skipping insert.`);
        } else {
            const userResult = await db.collection('users').insertMany(usersData);
            console.log(`Successfully inserted ${userResult.insertedCount} users`);
        }

        const productsPath = path.join(__dirname, 'products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        const productCount = await db.collection('products').countDocuments();
        if (productCount > 0) {
            console.log(`Products collection already has ${productCount} records. Skipping insert.`);
        } else {
            const productResult = await db.collection('products').insertMany(productsData);
            console.log(`Successfully inserted ${productResult.insertedCount} products`);
        }

        console.log('Database seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
});
