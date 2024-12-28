const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerAnnotation = require("./swagger.annotation")

module.exports = (app) => { 
    app.use((req, res, next) => {
        var localhost = true
        if(req.hostname != "127.0.0.1" && req.hostname != "localhost"){
            localhost = false
        }


        next()
        
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                title: 'Electric Bike Rental',
                version: '1.0.0',
                description: 'Electric Bike Rental Documentation',
                },
                servers: [
                {
                    url: localhost ? "http://127.0.0.1:3000/api-docs" : "",
                    description: 'Development server',
                },
                ],
                paths: swaggerAnnotation,
                tags: [
                    { name: 'Auth', description: 'Endpoints related to user authentication' },
                ]
            },
            apis: ['./app.js'],
        };
        
        const setup = swaggerJsdoc(options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(setup));
        console.log("app")
    })
};