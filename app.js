const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require('body-parser');
require('dotenv').config()
require("dotenv").config();
const userRoutes = require("./api/routes/userRoute")
const bikeRoute = require("./api/routes/bikeRoute")
const rentalRoute = require("./api/routes/rentalRoute")
// const trackRoute = require("./api/routes/trackRoute")
const paypalRoute = require("./api/routes/paypalRoute")
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cors())
// swaggerDocs(app)

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
            url: true ? "/" : "/",
            description: 'Development server',
        },
        ],
        // paths: swaggerAnnotation,
        tags: [
            { name: 'Auth', description: 'Endpoints related to user authentication' },
            { name: 'Bikes', description: 'Endpoints related to Bike function' },
            { name: 'Rental', description: 'Endpoints related to rental history' },
            { name: 'Reviews', description: 'Endpoints related to bike reviews' },
            { name: 'QRCode', description: 'Endpoints related to Bike QRcode scanner' },
            { name: 'Payments', description: 'Endpoints related to platform payment' },
            { name: 'GPS', description: 'Endpoints related to GPS navigating' },
            { name: 'Fitness tracker', description: 'Endpoints related to Fitness tracker' },
            { name: 'Assistant', description: 'Endpoints related to Navigation assistant' },
        ]
    },
    apis: ["./app.js"],
};
const setup = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(setup));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    }
    next()
})

app.get("/", (req, res) => {
    res.status(200).json({
        message : "Welcome to Electric Bike Rental API",
        version : "1.0",
        author : "Nextech"
    })
})

app.use("/user", userRoutes)
app.use("/bike", bikeRoute)
app.use("/rental", rentalRoute)
// app.use("/navigation", trackRoute)
app.use("/payment", paypalRoute)

app.use((req, res) => {
    res.status(404).json({
        message : "Endpoint not found"
    })
})
module.exports = app

// users
/**
* @swagger
* /user/signup:
*   post:
*     tags: [Auth]
*     summary: Create a new user
*     description: |
*       This endpoint allows you to create a new user account.
*       To create a user, you must provide the following information:
*
*       - email: The email address of the user. This field is required.
*       - password: The password for the user account. This field is required.
*       - name: The name for the user account. This field is required.
*       - phone: The phone number for the user account. This field is required.
*
*       Upon successful creation, the endpoint returns a response with status code 201 (Created).
*     requestBody:
*       description: User object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*               phone:
*                 type: string
*             required:
*               - name
*               - email
*               - password
*               - phone
*     responses:
*       201:
*         description: User created successfully
*/

/**
* @swagger
* /user/update:
*   patch:
*     tags: [Auth]
*     summary: Update a user
*     description: |
*       This endpoint allows you to update a user account.
*       To update a user, you must provide the following information:
*
*       - id: The id  of the user. This field is required.
*       - email: The email address for the user account.
*       - firstname: The firstname  for the user account.
*       - lastname: The lastname for the user account.
*       - phone: The phone for the user account.
*       - username: The username for the user account.
*       - address: The address  for the user account.
*
*       Upon successful creation, the endpoint returns a response with status code 200 (okay).
*     requestBody:
*       description: User object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*                 type: string
*               username:
*                 type: string
*               phone:
*                 type: string
*             required:
*               - id
*     responses:
*       200:
*         description: User updated successfully
*/

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: |
 *       This endpoint allows users to log in to their accounts.
 *       To authenticate, users must provide their email and password.
 *
 *       - email/phone: The email address of the user or phone number of the user. This field is required.
 *       - password: The password for the user account. This field is required.
 *
 *       Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with an authentication token.
 *
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 */

/**
 * @swagger
 * /user/confirm-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Confirm OTP
 *     description: |
 *       This endpoint allows users to confirm the one-time password (OTP) they received for authentication purposes.
 *       Users must provide the OTP they received via email.
 *
 *       Upon successful confirmation, the user's authentication is validated and they can proceed with their desired action.
 *
 *       Note: The OTP expires after a certain period and can only be used once for authentication.
 *     requestBody:
 *       description: OTP object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - userId
 *               - code
 *     responses:
 *       200:
 *         description: OTP confirmed successfully
 */

/**
 * @swagger
 * /user/request-password-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     description: |
 *       This endpoint allows users to request a password reset by providing their email address.
 *       Upon successful request, a password reset OTP will be sent to the provided email address.
 *
 *       Note: The password reset OTP is valid for a limited time period and can only be used once.
 *     requestBody:
 *       description: Password object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset pin sent
 */

/**
 * @swagger
 * /user/confirm-password-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Confirm request password
 *     description: |
 *       This endpoint allows users to confirm a password reset request by providing a new password and a token received via email.
 *       Upon successful confirmation, the user's password will be updated to the new password.
 *
 *       Note: The password reset token expires after a certain period and can only be used once.
 *     requestBody:
 *       description: Password object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - code
 *               - password
 *     responses:
 *       200:
 *         description: Your password has been reset successfully
 */

/**
 * @swagger
 * /user/request-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Request OTP
 *     description: |
 *       This endpoint allows users to request a one-time password (OTP) for authentication purposes.
 *       Users must provide their email address to receive the OTP.
 *       Upon successful request, the OTP is sent to the provided email address.
 *
 *       - email/phone: The email address or phone number of the user. This field is required.
 *
 *       Note: The OTP expires after a certain period and can only be used once for authentication.
 *     requestBody:
 *       description: OTP object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [Auth]
 *     summary: Get all user
 *     description: |
 *       This endpoint allows to fetch all users on the platform.
 *
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */


// bikes
/**
 * @swagger
 * /bike:
 *   post:
 *     tags: [Bikes]
 *     summary: Get all bikes
 *     description: |
 *       This endpoint allows to fetch all bikes on the platform.
 *
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */

/**
 * @swagger
 * /bike/create:
 *   post:
 *     tags: [Bikes]
 *     summary: Add new bike
 *     description: |
 *       This endpoint allows to add new bikes on the platform.
 *         - bikename: The bike name. This field is required.
 *         - type: The bike type. This field is required.
 *         - description: The bike description. This field is required.
 *         - image: The bike image.
 *         - pricerange: The bike pricerange. This field is required.
 *         - telephone: The bike station telephone. This field is required.
 *         - available: The bike availability. This field is required.
 *         - pricePerHour: The bike pricePerHour. This field is required.
 *         - pricePerDay: The bike pricePerDay. This field is required.
 *         - wheelsize: The bike wheelsize. This field is required.
 *         - manufactured: The bike manufactured date. default is 2024.
 *         - tires: The bike tires type.
 *
 *     requestBody:
 *       description: Adding bike object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bikename:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               pricerange:
 *                 type: string
 *               telephone:
 *                 type: string
 *               pricePerHour:
 *                 type: string
 *               pricePerDay:
 *                 type: string
 *               available:
 *                 type: string
 *               wheelsize:
 *                 type: string
 *               tires:
 *                 type: string
 *               manufactured:
 *                 type: string
 *             required:
 *               - bikename
 *     responses:
 *       200:
 *         description: bike added successfully
 */

/**
 * @swagger
 * /bike/delete:
 *   delete:
 *     tags: [Bikes]
 *     summary: Delete a bike
 *     description: |
 *       This endpoint allows to delete a bike on the platform.
 *         - id: The bike id. This field is required.
 *
 *     requestBody:
 *       description: Adding bike object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: bike added successfully
 */

// qr code
/**
 * @swagger
 * /qr-code:
 *   get:
 *     tags: [QRCode]
 *     summary: Get bike functions with QR code scanner
 *     description: |
 *       This endpoint allows to fetch bikes with qr code scanner on the platform.
 *
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */


// rental
/**
* @swagger
* /rental:
*   post:
*     tags: [Rental]
*     summary: Rent a Bike
*     description: |
*       This endpoint allows you to rent a bike for a  user.
*       To rent a bike, you must provide the following information:
*
*       - user: The user id. This field is required.
*       - bike: The bike id. This field is required.
*       - rentHr: The hour(s) of bike rental. This field is required.
*
*     requestBody:
*       description: Rental object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               user:
*                 type: string
*               bike:
*                 type: string
*               rentHr:
*                 type: string
*             required:
*               - user
*               - bike
*               - rentHr
*     responses:
*       200:
*         description: Rental created successfully
*/

/**
* @swagger
* /rental/history:
*   get:
*     tags: [Rental]
*     summary: Get User Rental History
*     description: |
*       This endpoint allows you to get a particular user rental history.
*       To get history, you must provide the following information:
*
*       - userId: The user id. This field is required.
*
*     requestBody:
*       description: Rental object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*             required:
*               - userId
*     responses:
*       200:
*         description: Rental created successfully
*/


// reviews
/**
* @swagger
* /user/reviews:
*   post:
*     tags: [Reviews]
*     summary: Drop a review for a Bike
*     description: |
*       This endpoint allows you to add review for a bike.
*       To add a review, you must provide the following information:
*
*       - user: The user id. This field is required.
*       - bike: The bike id. This field is required.
*       - title: The review title. This field is required.
*       - comment: The review comment. This field is required.
*       - rating: The review rating. This field is required.
*
*     requestBody:
*       description: Review object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               user:
*                 type: string
*               bike:
*                 type: string
*               title:
*                 type: string
*               comment:
*                 type: string
*               rating:
*                 type: number
*             required:
*               - user
*               - bike
*               - title
*               - comment
*               - rating
*     responses:
*       200:
*         description: Review created successfully
*/

/**
* @swagger
* /user/reviews:
*   get:
*     tags: [Reviews]
*     summary: Fetch all platform review
*     description: |
*       This endpoint allows you to fetch all platform review for bikes.
*
*     requestBody:
*       description: Reviews object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*             required:
*     responses:
*       200:
*         description: Review fetch successfully
*/


/**
* @swagger
* /user/bike-reviews:
*   get:
*     tags: [Reviews]
*     summary: Fetch reviews of a particular Bike
*     description: |
*       This endpoint allows you to fetch reviews of a particular Bike.
*       To fetch reviews, you must provide the following information:
*
*       - bikeId: The bike id. This field is required.
*
*     requestBody:
*       description: Reviews object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               bikeId:
*                 type: string
*             required:
*               - bikeId
*     responses:
*       200:
*         description: Review fetch successfully
*/



/**
* @swagger
* /rental:
*   get:
*     tags: [Rental]
*     summary: Get all Platform Rental History
*     description: |
*       This endpoint allows you to get all platform rental history.
*
*     requestBody:
*       description: Rental object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*             required:
*     responses:
*       200:
*         description: Rental created successfully
*/


/**
 * @swagger
 * /navigation/route:
 *   post:
 *     tags: [GPS]
 *     summary:  Get User Current Route
 *     description: |
 *       This endpoint allows users to view and get their current route
 *       for testing purpose, use this start=3.3792,6.5244, end=4.5426,8.4966
 *         - start: The latitude and longitude the user start from. This field is required.
 *         - end: The latitude and longitude the user is going to. This field is required.
 *
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *            type: string
 *       - in: query
 *         name: end
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Current route get successfully,
 */


/**
* @swagger
* /rental/history:
*   get:
*     tags: [Rental]
*     summary: Get User Rental History
*     description: |
*       This endpoint allows you to get a particular user rental history.
*       To get history, you must provide the following information:
*
*       - userId: The user id. This field is required.
*
*     requestBody:
*       description: Rental object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*             required:
*               - userId
*     responses:
*       200:
*         description: Rental created successfully
*/


/**
 * @swagger
 * /navigation/map:
 *   post:
 *     tags: [GPS]
 *     summary:  Get User Current Map
 *     description: |
 *       This endpoint allows users to view and get their current map
 *       for testing purpose, use this lat=6.5244, lon=3.3792
 *         - longitude: The current longitude of the user. This field is required.
 *         - latitude: The current latitude of the user. This field is required.
 *
 *
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *            type: string
 *       - in: query
 *         name: lon
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Current map get successfully,
 */

/**
 * @swagger
 * /navigation/assistant:
 *   post:
 *     tags: [Assistant]
 *     summary:  Navigation Assistant
 *     description: |
 *       This endpoint help users in navigating their current route
 *       for testing purpose, use this destination=9.0765,7.3986, origin=6.5244,3.3792
 *         - origin: The current origin of the user. This field is required.
 *         - destination: The current destination of the user. This field is required.
 *
 *
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *            type: string
 *       - in: query
 *         name: origin
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *         description:  Navigation Assistant
 */

/**
 * @swagger
 * /payment/paypal:
 *   post:
 *     tags: [Payments]
 *     summary:  Pay with Paypal
 *     description: |
 *       This endpoint help users to use paypal as their payment method
 *         - rentId: The rental ID user wanted to make payment for . This field is required.
 *         - amount: The total amount to be paid. This field is required.
 *         - userId: The user ID. This field is required.
 *
 *     requestBody:
 *       description: Payment object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *               rentId:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - amount
 *               - userId
 *               - rentId
 *     responses:
 *       200:
 *         description:  Payment
 */

/**
 * @swagger
 * /payment/stripe:
 *   post:
 *     tags: [Payments]
 *     summary:  Pay with Stripe
 *     description: |
 *       This endpoint help users to use stripe as their payment method
 *         - rentId: The rental ID user wanted to make payment for . This field is required.
 *         - userId: The user ID. This field is required.
 *
 *     requestBody:
 *       description: Payment object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rentId:
 *                 type: string
 *               currency:
 *                 type: string
 *               amount:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - rentId
 *               - userId
 *               - amount
 *               - currency
 *     responses:
 *       200:
 *         description: Payment
 */



