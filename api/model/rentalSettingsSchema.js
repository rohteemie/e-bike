const mongoose = require("mongoose")

const schema = mongoose.Schema

const RentalSettingsSchema = new schema({
    ride_price : {type : String, default : null},
    pause_price : {type : String, default : null},
    fee : {type : String, default : null},
},{timestamps : true})

module.exports = mongoose.model("RentalSetting", RentalSettingsSchema)