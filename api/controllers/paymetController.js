require('dotenv').config();
const { getPaypalAccessToken } = require('../middleware/paypalToken');
const axios = require('axios');
const paypal = require('../../utils/paypayConfig');
const nodemailer = require('nodemailer');
const userSchema = require("../model/userSchema");
const paymentSchema = require('../model/paymentSchema');
const rentalSchema= require('../model/bookingSchema');



/**
 * Sends an email verification for a payment initiation.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} name - The recipient's name.
 * @param {number} amount - The payment amount.
 */
const sendEmailverify = (to, name, amount) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_CLIENT_ID,
            pass: process.env.EMAIL_CLIENT_SECRET,
        }
    });

    var mailOptions = {
        to: to,
        subject: 'Payment Confirmation',
        html: `
            <a href="" class="logo d-flex" style="text-align: center; margin-bottom:.5em">
                <h2 class="fw-bold mx-2 text-white">Fodi Serre </h2>
            </a>
            <h3 style="text-align: center; margin-top:0">Payment Confirmation</h3>

            <hr>
            <h3 style="margin-top:2em">Dear ${name || 'Customer'},</h3>
            <p style="line-height: 28px">We are pleased to inform you that a payment request of <strong>$${amount}</strong> was initiated on your account.</p>
            <p>This payment is initiated for rental, and your transaction status will be sent to you once it is completed.</p>
            <p>For your records, please find the payment details below:</p>

            <h4>Payment Summary:</h4>
            <ul>
                <li>Amount: $${amount}</li>
                <li>Transaction Type: Bike Rental</li>
                <li>Date: ${new Date().toLocaleDateString()}</li>
            </ul>

            <hr>
            <p>If you have any questions or need further assistance, feel free to contact our support team.</p>

            <h3 style="margin-bottom: .3em">Thank you for choosing Fodi Serre!</h3>
            <p>Best regards,</p>
            <h3>Fodi Serre Team</h3>

            <p>If you think this was a mistake, contact us at:</p>
            <p><a href="mailto:info@parcodelleserre.it">info@parcodelleserre.it</a></p>
            <p><a href="https://www.bikeserre.it">Fodi Serre</a></p>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log(info.response);
        }
    });
};



/**
 * Handles the PayPal payment process for bike rental services.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.amount - The amount to be paid.
 * @param {string} req.body.userId - The ID of the user making the payment.
 * @param {string} req.body.rentId - The ID of the rental.
 * @param {Object} res - The response object.
 *
 * @returns {void}
 */
const Paypal = (req, res) => {
    const { amount, userId } = req.body;
    user_ = userId;
    amount_ = amount;

    userSchema.findById(userId)
        .then(user => {
            if (user) {
                const userEmail = user.email;

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `https://electricbike-100t.onrender.com/payment/success-paypal?userId=${userId}&amount=${amount}`,
                        "cancel_url": "https://electricbike-100t.onrender.com/payment/cancel-paypal"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": "Rental",
                                "sku": "Bike",
                                "price": amount ?? "1.00",
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": amount ?? "1.00"
                        },
                        "description": "Payment for bike rental services"
                    }]
                };

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        console.error(error);
                        res.status(500).send(error);
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                // Call the email function, passing the extracted user email
                                sendEmailverify(userEmail, user.name, amount);

                                return res.status(200).json({ redirect_url: payment.links[i].href });
                            }
                        }
                    }
                });
            } else {
                res.status(404).send({message: `User with id: (${userId}) does not exist`});
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
};



/**
 * Handles the success URL callback after a payment is completed.
 *
 * @async
 * @function successUrl
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.userId - The ID of the user.
//  * @param {string} req.query.rentId - The ID of the rental.
 * @param {string} req.query.amount - The amount of the payment.
 * @param {Object} res - The response object.
 */
const successUrl = async (req, res) => {
    const { userId, amount, paymentId, PayerID } = req.query;

    try {
        // Find the user by userId
        const user = await userSchema.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Define the payment execution object
        const execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": amount
                }
            }]
        };

        // Execute the payment
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                // console.error(error.response);
                return res.status(500).json({ message: 'Payment execution failed', error: error.response });
            } else {
                // Payment was successful, save it to the database
                // console.log("Payment executed successfully:", payment);

                const paymentRecord = new paymentSchema({
                    user: user._id,
                    amount: amount,
                    paymentId: payment.id
                });

                paymentRecord.save()
                    .then(data => res.status(200).json({
                        message: "Transaction completed successfully",
                        data: data
                    }))
                    .catch(err => res.status(500).json({
                        message: "Transaction completed, but could not save payment record",
                        error: err
                    }));
            }
        });
    } catch (err) {
        // console.error("Error in successUrl:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
};



/**
 * Handles the cancellation of a transaction.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Responds with a JSON message indicating the transaction was cancelled.
 */
const CancelUrl = (req, res) => {
    res.status(200).json({ message: "Transaction was cancelled" });
};



/**
 * Fetches the payment history, sorts it by creation date in descending order,
 * and populates the rental and user fields.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Returns a JSON response with the payment history or a message if the history is empty.
 */
const paymentHistory = (req, res) => {
    paymentSchema.find()
    .sort({"createdAt" : "desc"})
    // .populate("rental")
    .populate("user")
    .then((data) => {
        if(data.length === 0){
            return res.status(200).json({
                message : "Payment history is empty",
            })
        }

        res.status(200).json({
            message : "Payment History is fetched successfully",
            data
        })
    })

}



/**
 * Fetches the balance from PayPal and returns it in the response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the  
 balance is fetched and sent in the response.
 * @throws {Object} - Returns a 500 status code with error details if the balance fetch fails.
 */
 async function balanace(req, res) {
    const accessToken = await getPaypalAccessToken();

    try {
        const response = await axios.get('https://api.paypal.com/v1/reporting/balances', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Balance:', response);
        console.log('Balance:', response.data);
        return res.status(200).json({ message: response });

    } catch (error) {
        if (error.response) {
            console.error('Error fetching balance:', error.response);
            return res.status(500).json({ message: error.response.data });
        } else if (error.request) {
            // Network or request-related error
            console.error('Error sending balance request:', error.request);
            return res.status(500).json({ message: 'An error occurred while contacting the server.' });
        } else {
            // Unexpected error
            console.error('Unexpected error fetching balance:', error);
            return res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
}



const fetchPaypalPayments = async (req, res) => {
    const accessToken = await getPaypalAccessToken();  // Fetch the PayPal access token

    try {
        const response = await axios.get('https://api.paypal.com/v1/payments/payment', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            params: {
                count: 10,  // Number of payments to retrieve, adjust as needed
                start_time: '2023-01-01T00:00:00Z',
                end_time: new Date().toISOString()
            }
        });

        // Send PayPal payments back in the response
        res.status(200).json({
            message: "PayPal payments fetched successfully",
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching PayPal payments:', error);
        res.status(500).json({
            message: "Failed to fetch PayPal payments",
            error: error.message
        });
    }
};



module.exports = {
    Paypal,
    successUrl,
    CancelUrl,
    paymentHistory,
    balanace,
    fetchPaypalPayments
};
