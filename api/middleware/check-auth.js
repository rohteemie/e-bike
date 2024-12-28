const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try{
        const authorization = req.headers.authorization.split(" ")[1]
        jwt.verify(authorization, "secret")
        next()
    }
    catch (err){
        res.status(403).json({
            message : "not authenticated",
            error : err
        })
    }
}