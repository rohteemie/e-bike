const express = require("express")
const route = express.Router()
const bikeController = require("../controllers/bikeController")

route.post("/", bikeController.getAllBikes)
route.post("/create", bikeController.createBike)
route.post("/update", bikeController.UpdateBike)
route.post("/delete", bikeController.DeleteBike)
// route.post("/connect", bikeController.newBike)
route.post("/connect", bikeController.unlockDevice)
route.post("/lockDevice", bikeController.lockDevice)
// route.post("/establish", bikeController.establish)


module.exports = route