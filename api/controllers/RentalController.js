const rentalSchemaSchema = require("../model/bookingSchema")
const bikeSchema = require("../model/bikeSchema")
const axios = require('axios');
var bikeID = 0

const rentBike = (req, res) => {
    const {user, bike, rentHr, expiretime} = req.body
    bikeID = bike
    bikeSchema.find({_id: bike})
    .then(data => {
        if(data.length == 0){
            return res.status(400).json({
                message: "bike does not exist"
            })
        }

        if(!data[0].available){
            return res.status(400).json({
                message: "This bike is not available as of the moment, try another bike"
            })
        }

        const rent = new rentalSchemaSchema({
            user,
            bike,
            rentHr,
            expiretime,
            status: "In Progress"
        })

        rent.save()
        .then(() => {
            bikeSchema.findOneAndUpdate({_id: bike}, {available: false, status: "Rented"})
            .then(() => {
                res.status(200).json({
                    message : "bike rent is purchased successfully",
                })
            })
        })
        .catch( err => {
            res.status(500).json({
                message: err
            })
        })

    })
}

const BookRental = (req, res) => {
    const {rental_id} = req.body
    rentalSchemaSchema.findOneAndUpdate({_id: rental_id}, {status: "Booked"})
    .then((rental) => {
        bikeSchema.findOneAndUpdate({_id: rental.bike}, {available: false, status: "Booked"})
        .then((bike_) => {
            res.status(200).json({
                message : "Rental status has been changed successfully",
                bike_
            })
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
}

const CancelRental = (req, res) => {
    const {rental_id} = req.body
    rentalSchemaSchema.findOneAndUpdate({_id: rental_id}, {status: "Cancel"})
    .then((rental) => {
        bikeSchema.findOneAndUpdate({_id: rental.bike}, {available: false, status: "Available"})
        .then((bike_) => {
            res.status(200).json({
                message : "Rental status has been changed successfully",
                bike_
            })
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
}

const CompleteRental = (req, res) => {
    const {rental_id} = req.body
    rentalSchemaSchema.findOneAndUpdate({_id: rental_id}, {status: "Completed"})
    .then((rental) => {
        bikeSchema.findOneAndUpdate({_id: rental.bike}, {available: true, status: "Available"})
        .then((bike_) => {
            res.status(200).json({
                message : "Rental status has been changed successfully",
                bike_
            })
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
}

const userRentHistory = (req, res) => {
    const {userId} = req.body
    rentalSchemaSchema.find({user: userId})
    .populate("bike")
    .populate("user")
    .then((data) => {
        if(data.length == 0){
            return res.status(200).json({
                message : "This User does not have bike rental history",
            })
        }

        res.status(200).json({
            message : "User History is fetched successfully",
            data
        })
    })

}

const navigationGPS = async (req, res) => {
    const { start, end } = req.body;
    if (!start || !end) {
        return res.status(400).send('Start and end coordinates are required');
    }

    try {
        const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}`, {
            params: {
                access_token: 'YOUR_MAPBOX_ACCESS_TOKEN',
                alternatives: true,
                geometries: 'geojson',
                steps: true
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const RentHistory = (req, res) => {
    rentalSchemaSchema.find()
    .sort({"createdAt" : "desc"})
    .populate("bike")
    .populate("user")
    .then((data) => {
        if(data.length == 0){
            return res.status(200).json({
                message : "Bike rental history is empty",
            })
        }

        res.status(200).json({
            message : "User History is fetched successfully",
            data
        })
    })

}


module.exports = {
    rentBike,
    userRentHistory,
    navigationGPS,
    RentHistory,
    CompleteRental,
    BookRental,
    CancelRental,
}
