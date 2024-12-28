const mongoose = require("mongoose")

const schema = mongoose.Schema

const rentalSchema = new schema({
    user : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "User"},
    bike : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "Bikes"},
    expiretime:  {type : String},
    rentHr:  {type : String, required : true},
    is_expired:  {type : Boolean, default : false},
    status:  {type : String, default : "In Progress"},
},{timestamps : true})

module.exports = mongoose.model("Rental", rentalSchema)