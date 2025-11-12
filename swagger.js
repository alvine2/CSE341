const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'QuickCart  API',
    description: 'API for managing users, products, orders and reviews',
  },
  host: 'localhost:3000',
  schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
