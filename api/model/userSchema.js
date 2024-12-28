const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema({
    firstname : {type : String, required : true},
    lastname : {type : String, default : null},
    username : {type : String, default : null},
    address : {type : String, default : null},
    email : {type : String, required : true},
    password : {type : String, required : true},
    phone : {type : Number, default : null},
    isverified : {type : Boolean, default : false}
},{timestamps : true})

module.exports = mongoose.model("User", userSchema)