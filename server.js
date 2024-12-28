/**
 * @module server
 * @description This module is responsible for creating and configuring the server for the OMNI-Bike application.
 */

/**
 * @requires http
 * @requires app
 * @requires mongoose
 * @requires socket.io
 * @requires dotenv
 */

/**
 * @constant {Object} http - The HTTP module provides functionality to create an HTTP server.
 * @constant {Object} app - The app module contains the application logic.
 * @constant {Object} mongoose - The mongoose module provides a straight-forward, schema-based solution to model your application data.
 * @constant {Object} socketIo - The socket.io module enables real-time, bidirectional and event-based communication between the browser and the server.
 */

/**
 * @constant {string} MONGO_DB_USER - The MongoDB database user.
 * @constant {string} MONGO_DB_PASSWORD - The MongoDB database password.
 */

/**
 * @constant {Object} server - The HTTP server instance.
 * @constant {Object} io - The socket.io server instance.
 */

/**
 * @constant {string} dbUrl - The MongoDB connection URL.
 */

/**
 * Establishes a connection to the MongoDB database and starts the server.
 * @function
 * @name startServer
 * @returns {void}
 */
const http = require("http")
const app = require("./app")
const mongoose = require("mongoose")
const socketIo = require('socket.io');


require("dotenv").config();
const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const PORT = process.env.PORT;

const server = http.createServer(app)
const io = socketIo(server);

/**
 * Database connection URL.
 * @type {string}
 */
const dbUrl = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@e-bike.khdgd.mongodb.net/?retryWrites=true&w=majority&appName=E-Bike`;

mongoose.connect(dbUrl)
.then(
    server.listen(PORT || 3200,() => {
        console.log("App is running in port 3000")
        io.on('connection', (socket) => {
            console.log('a user connected');
        })
    })
)
.catch(err => {
    console.log(err)
})


