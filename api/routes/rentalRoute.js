const express = require("express")
const route = express.Router()
const RentalController = require("../controllers/RentalController")

route.post("/", RentalController.rentBike)
route.post("/completed", RentalController.CompleteRental)
route.post("/cancel", RentalController.CancelRental)
route.post("/book", RentalController.BookRental)
route.post("/history", RentalController.userRentHistory)
route.post("/navigation", RentalController.navigationGPS)
route.get("/", RentalController.RentHistory)


module.exports = route