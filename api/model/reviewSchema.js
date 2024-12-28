const mongoose = require("mongoose")

const schema = mongoose.Schema

const reviewSchema = new schema({
    user : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "User"},
    bike : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "Bikes"},
    title : {type : String, required : true},
    comment : {type : String, required : true},
    rating : {type : Number, required : true}
},{timestamps : true})

module.exports = mongoose.model("Review", reviewSchema)