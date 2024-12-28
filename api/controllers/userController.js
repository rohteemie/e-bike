const userSchema = require("../model/userSchema")
const CodeSchema = require("../model/codeSchema")
const adminSchema = require("../model/adminSchema")
const reviewSchema = require("../model/reviewSchema")
const notificationsSchema = require("../model/notificationsSchema")
const rentalSettingsSchema = require("../model/rentalSettingsSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
require('dotenv').config()


const sendPasswordReset = (to, name, code) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_CLIENT_ID,
            pass: process.env.EMAIL_CLIENT_SECRET
        }
    });

    var mailOptions = {
        to: to,
        subject: 'Password Reset',
        html: `
            <a href="" class="logo d-flex" style="text-align: center; margin-bottom:.5em">
                <h2 class="fw-bold mx-2 text-white">Fodi Serra </h2>
            </a>
            <h3 style="text-align: center; margin-top:0">Password Reset</h3>

            <hr>
            <h3 style="margin-top:2em">Dear ${name},</h3>
            <p style="line-height: 28px">You requested for password reset code. Please verify your account if it is you.</p>
            <h4>Please verify with</h4> <h1>${code}</h1>
            <p>Password reset code will expire in 15 minutes</p>
            <p>If you did not request for this? , please ignore this email.</p>
            <h3 style="margin-bottom: .3em">Thank you,</h3>
            <h3>Fodi Serre Team</h3>
            <p>If you have any questions or need assistance, feel free to contact our support team at info@parcodelleserre.it</p>

            <p>Best regards</p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href="">info@parcodelleserre.it</a></p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href=""> Fodi Serre </a></p>

        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        }else{
            console.log(info.response)
        }
    });


}

const sendEmailverify = (to, name, code) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_CLIENT_ID,
            pass: process.env.EMAIL_CLIENT_SECRET,
        }
    });

    var mailOptions = {
        to: to,
        subject: 'Account Verification',
        html: `
            <a href="" class="logo d-flex" style="text-align: center; margin-bottom:.5em">
                <h2 class="fw-bold mx-2 text-white">Fodi Serre </h2>
            </a>
            <h3 style="text-align: center; margin-top:0">Account Verification</h3>

            <hr>
            <h3 style="margin-top:2em">Dear ${name},</h3>
            <p style="line-height: 28px">Thank you for registering with Fodi Serre. Please verify your email address to complete the signup process</p>
            <h4>Please verify with</h4> <h1>${code}</h1>
            <p>Verification Code will expire in 15 minutes</p>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <h3 style="margin-bottom: .3em">Thank you,</h3>
            <h3>Fodi Serre Team</h3>
            <p>If you have any questions or need assistance, feel free to contact our support team at info@parcodelleserre.it</p>

            <p>Best regards</p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href="">info@parcodelleserre.it</a></p>
            <p style="margin-bottom: 1em; pst-style-type:none"><a href=""> Fodi Serre </a></p>

        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        }else{
            console.log(info.response)
        }
    });


}

const generateCode = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
}

const createAdmin = (req, res) => {
    adminSchema.find({email : req.body.email})
    .then(result => {
       if(result.length >= 1){
            res.status(400).json({
                message : "user already exist"
            })
       }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(hash){
                    const user = new adminSchema({
                        fullname : req.body.fullname,
                        password : hash,
                        email : req.body.email,
                        phone : req.body.phone,
                    })
                    user.save()
                    .then(data => {
                        res.status(200).json({
                            message : "Admin created successfully",
                            user,
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            message: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: "Something went wrong"
                    })
                }
            })
       }
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })


}

const loginAdmin = (req, res) => {

    adminSchema.find({email : req.body.email})
    .then(user => {
       if(user.length >= 1){
            bcrypt.compare(req.body.password, user[0].password, (err , bol) => {
                if(bol){
                    res.status(200).json({
                        message : "Admin logged  in",
                        user: user[0],
                    })
                }else{
                    res.status(403).json({
                        message : "incorrect credentials"
                    })
                }
            })
       }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })

}

const UpdateAdmin = (req, res) => {
    const {name, email, password, id} = req.body
    if(password){
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(hash){
                adminSchema.findOneAndUpdate({_id : id}, {fullname: name, password: hash, email: email })
                .then(result => {
                    if(!result){
                        return res.status(400).json({
                            message: "admin does not exist"
                        })
                    }
                    res.status(200).json({
                        message: "admin has been updated succesfully",
                        user: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message : err
                    })
                })
            }
        }
        );
    }else{
    adminSchema.findOneAndUpdate({_id : id}, {fullname: name, email: email })
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "admin does not exist"
            })
        }
        res.status(200).json({
            message: "admin has been updated succesfully",
            user: result
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    }) }
}


const createUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(result => {
       if(result.length >= 1){
            res.status(400).json({
                message : "user already exist"
            })
       }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(hash){
                    const user = new userSchema({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        password : hash,
                        email : req.body.email,
                        phone : req.body.phone,
                        username : req.body.username,
                    })

                    user.save()
                    .then(data => {
                        const token = jwt.sign({
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            email : req.body.email,}, "secret", {expiresIn : "12h"}
                        )
                        var code = generateCode()
                        var saveCode = new CodeSchema({
                            code: code,
                            userId: data._id
                        })
                        saveCode.save()

                        sendEmailverify(req.body.email, req.body.firstname, code)

                        res.status(200).json({
                            message : "user created successfully",
                            user,
                            "access-token" : token
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            message: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: "Something went wrong"
                    })
                }
            })
       }
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })


}

const loginUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(user => {
       if(user.length >= 1){
            bcrypt.compare(req.body.password, user[0].password, (err , bol) => {
                if(bol){
                   const token = jwt.sign({
                        email : user[0].email,
                        firstname : user[0].firstname,
                        lastname : user[0].lastname,}, "secret", {expiresIn : "12h"}
                    )
                    res.status(200).json({
                        message : "user logged  in",
                        user: user[0],
                        "access-token" : token
                    })
                }else{
                    res.status(403).json({
                        message : "incorrect credentials"
                    })
                }
            })
       }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })

}

const getAllUser = (req, res) => {
   userSchema.find()
   .sort({"createdAt" : "desc"})
   .then(data => {
        res.status(200).json({
            message : "users fetched successfully",
            users : data
        })
   })
   .catch(err => {
    res.status(500).json({
        error : err
    })
   })
}

const getUserByEmail = (req, res) => {
    if(req.body.email){
        userSchema.find({"email" : req.body.email})
        .then(data => {
            res.status(200).json({
                message : "users fetched successfully",
                users : data
            })
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })
    }else{
        res.status(404).json({
            message : "user not found"
        })
    }
}

const UpdateUser = (req, res) => {
    const {firstname, lastname, email, id, phone, address, username} = req.body
    userSchema.findOneAndUpdate({_id : id}, {firstname:firstname, lastname: lastname, email:email, phone:phone, address:address, username:username })
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "User does not exist"
            })
        }
        res.status(200).json({
            message: "User has been updated succesfully",
            data: result
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })


}

const verifyCode = (req, res) => {
    CodeSchema.find({"code" : req.body.code})
    .then(data => {
        if(data.length == 0){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        if( req.body.userId != data[0].userId){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        userSchema.findOneAndUpdate({_id : req.body.userId}, {isverified: true})
        .then(() => {
            CodeSchema.findOneAndDelete({"code" : req.body.code})
            .then( codeRes => {
                return res.status(200).json({
                    message : "Account Verified Successfully"
                })
            })
       })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })
}

const createReview = (req, res) => {
    const {user, bike, title, comment, rating} = req.body
    userSchema.find({_id : user})
    .then(users => {
        if(users.length == 0){
            return res.status(400).json({
                message : "User does not exist",
            })
        }

        const review = new reviewSchema({
            user,
            bike,
            title,
            comment,
            rating
        })

        review.save()
        .then(data => {
                res.status(200).json({
                    message : "review created successfully",
                    data,
                })
        })
        .catch( err => {
            res.status(500).json({
                message: err
            })
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })

}

const getallReviews = (req, res) => {
    reviewSchema.find()
    .populate("user")
    .populate("bike")
    .then(reviews => {
        if(reviews.length == 0){
            return res.status(400).json({
                message : "there are no reviews",
            })
        }

        return res.status(200).json({
            message : "reviews fetch successfully",
            reviews
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })

}

const getbikesReviews = (req, res) => {
    const {bikeId} = req.body
    reviewSchema.find({bike: bikeId})
    .populate("user")
    .populate("bike")
    .then(reviews => {
        if(reviews.length == 0){
            return res.status(400).json({
                message : "there are no reviews for this bike",
            })
        }

        return res.status(400).json({
            message : "reviews fetch for this bike successfully",
            reviews
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })

}

const requestCode = (req, res) => {
    const {email} = req.body

    if(!email){
        return res.status(404).json({
            message : "Missing field: User Email is required",
        })
    }

    userSchema.find({email : email})
    .then(user => {
       if(user.length >= 1){
            var code = generateCode()
            var saveCode = new CodeSchema({
                code: code,
                userId: user[0]._id
            })
            saveCode = saveCode.save()

            if(saveCode){
                var send = sendEmailverify(email, user[0].firstname, code);
                return res.status(200).json({
                    message : `Verification Code has been sent to ${email}`,
                })
            }
        }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

const requestPasswordCode = (req, res) => {
    const {email} = req.body

    if(!email){
        return res.status(404).json({
            message : "Missing field: User Email is required",
        })
    }

    userSchema.find({email : email})
    .then(user => {
       if(user.length >= 1){
            var code = generateCode()
            var saveCode = new CodeSchema({
                code: code,
                userId: user[0]._id
            })
            saveCode = saveCode.save()

            if(saveCode){
                var send = sendPasswordReset(email, user[0].firstname, code);
                return res.status(200).json({
                    message : `Password Reset Code has been sent to ${email}`,
                })
            }
        }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

const verifyPasswordReset = (req, res) => {
    CodeSchema.find({"code" : req.body.code})
    .then(data => {
        if(data.length == 0){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        if( req.body.userId != data[0].userId){
            return res.status(400).json({
                message : "Invalid code",
            })
        }

        userSchema.findOneAndUpdate({_id : req.body.userId}, {password: req.body.password})
        .then(() => {
            CodeSchema.findOneAndDelete({"code" : req.body.code})
            .then( codeRes => {
                return res.status(200).json({
                    message : "Password Reset Successfully"
                })
            })
       })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })
}

const DeleteUser = (req, res) => {
    const {id} = req.body
    userSchema.findOneAndDelete({_id : id})
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "User does not exist"
            })
        }
        res.status(200).json({
            message: "User has been deleted succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })


}

const CreateNotifications = (req, res) => {
    const {id, title, message} = req.body
    const user = new notificationsSchema({
        user : id,
        title : title,
        message: message,
    })

    user.save()
    .then(data => {
        res.status(200).json({
            message : "Notification created successfully",
            data,
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })


}

const getNotifications = (req, res) => {
    const {id} = req.params
    notificationsSchema.find({user: id})
    .populate("user")
    .then(notifications => {
        if(notifications.length == 0){
            return res.status(400).json({
                message : "there are no notifications",
            })
        }

        return res.status(200).json({
            message : "notifications fetch successfully",
            notifications
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })

}


const UpdateRental = (req, res) => {
    const {ride_price, pause_price, fee, id} = req.body
    rentalSettingsSchema.findOneAndUpdate({_id : id}, {ride_price: ride_price, pause_price: pause_price, fee: fee })
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "rental settings does not exist"
            })
        }
        res.status(200).json({
            message: "rental settings has been updated succesfully",
            data: result
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })
}

const createRentalSetting = (req, res) => {
    const {ride_price, pause_price, fee} = req.body
    const user = new rentalSettingsSchema({
        ride_price: ride_price,
        pause_price: pause_price,
        fee: fee
    })

    user.save()
    .then(data => {
        res.status(200).json({
            message : "Rental settings created successfully",
            data,
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })


}

const getRentalSettings = (req, res) => {
    rentalSettingsSchema.find()
    .then(Rentals => {
        return res.status(200).json({
            message : "Rentals fetch for this bike successfully",
            Rentals
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })

}


module.exports = {
    createUser,
    getAllUser,
    loginUser,
    getUserByEmail,
    verifyCode,
    UpdateUser,
    createReview,
    getallReviews,
    getbikesReviews,
    requestCode,
    requestPasswordCode,
    verifyPasswordReset,
    loginAdmin,
    createAdmin,
    DeleteUser,
    CreateNotifications,
    getNotifications,
    UpdateAdmin,
    UpdateRental,
    createRentalSetting,
    getRentalSettings
}
