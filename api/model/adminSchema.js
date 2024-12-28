const mongoose = require("mongoose")

const schema = mongoose.Schema

const Adminchema = new schema({
    fullname : {type : String},
    phone : {type : String},
    email : {type : String, required : true},
    password : {type : String, required : true},
},{timestamps : true})

module.exports = mongoose.model("Admin", Adminchema)