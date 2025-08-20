const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth & RBAC User Management API',
      version: '1.0.0',
      description: 'Authentication and User CRUD APIs with Role-Based Access Control',
    },
    servers: [
      { url: 'http://localhost:4000/api' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
  './src/routes/authRoutes.js',
  './src/routes/userRoutes.js',
  './src/routes/paymentRoutes.js',
  './src/routes/transferRoutes.js'
  ],

};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
