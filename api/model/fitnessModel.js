const mongoose = require("mongoose")

const schema = mongoose.Schema

const FitnessSchema = new schema({
    userId : {type : String, required : true},
    code : {type : String, required : true}
},{timestamps : true})

module.exports = mongoose.model("Fitness", FitnessSchema)