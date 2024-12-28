const express = require("express")
const route = express.Router()
const paymetController = require("../controllers/paymetController")

route.post("/paypal", paymetController.Paypal)
route.get("/cancel-paypal", paymetController.CancelUrl)
route.get("/success-paypal", paymetController.successUrl)
route.get("/balance", paymetController.balanace || paymetController.fetchPaypalPayments);
route.get("/history", paymetController.paymentHistory);


module.exports = route
