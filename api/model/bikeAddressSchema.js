const mongoose = require("mongoose")

const schema = mongoose.Schema

const bikeAddressSchema = new schema({
    streetAddress : {type : String, default : null},
    bike : {type : String, default : null},
    addressLocality : {type : String, default : null},
    addressRegion : {type : String, default : null},
    openingHours : {type : String, default : null},
    addressCountry : {type : String, default : "Italy"},
    postalCode : {type : Number, default : null},
},{timestamps : true})

module.exports = mongoose.model("BikeAddress", bikeAddressSchema)