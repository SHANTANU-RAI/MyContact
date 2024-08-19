const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required : [true , "pls add the user name"],
    },
    email: {
        type: String,
        required : [true , "pls add the email"],
        unique: [true , "email already taken"],
    },
    password : {
        type: String,
        required : [true , "pls add the user password"],
    },
},
{
    timestamps : true,
}
);

module.exports = mongoose.model("User" , userSchema );