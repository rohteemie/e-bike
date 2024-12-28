const mongoose = require("mongoose")

const schema = mongoose.Schema

const CodeSchema = new schema({
    userId : {type : String, required : true},
    code : {type : String, required : true}
},{timestamps : true})

module.exports = mongoose.model("Code", CodeSchema)