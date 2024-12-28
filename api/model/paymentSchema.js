const mongoose = require("mongoose")

const schema = mongoose.Schema

const paymentSchema = new schema({
    user : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "User"},
    // rental : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "Rental"},
    amount:  {type : String},
},{timestamps : true})

module.exports = mongoose.model("Payment", paymentSchema)