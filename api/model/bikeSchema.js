const mongoose = require("mongoose")

const schema = mongoose.Schema

const bikesSchema = new schema({
    bikename : {type : String},
    type : {type : String},
    BikeCode : {type : String},
    status : {type : String},
    description : {type : String, default : "Available"},
    image : {type : String, default : "https://capacity.rentbikesoft.pl/grafiki/oferta/256/65ddeb03ee0d8.png"},
    pricerange : {type : String},
    telephone : {type : String},
    available : {type : Boolean, default : true},
    pricePerHour : {type : String},
    pricePerDay : {type : String},
    wheelsize : {type : String, default : null},
    tires : {type : String, default : null},
    manufactured : {type : String, default : 2024},
    station : {type : String}
},{timestamps : true})

module.exports = mongoose.model("Bikes", bikesSchema)