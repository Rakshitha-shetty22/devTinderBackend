const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
        minLength: 5,
    },
    lastName: {
        type: String,
        minLength: 5,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,  //mongodb creates the index for this "unique"
        lowercase: true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)) 
                throw new Error("Invalid Email address..")
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) 
                throw new Error("please enter the strong password..")
        }
    },
    photoUrl : {
        type : String,
    },
    gender : {
        type: String,
        enum : {
            values : ["male", "female", "other"],
            message: `{VALUE} is incorrect status type`  //MANGOOSE will be replace VALUE with the value being validated
        }
    },
    skills:{
        type:[String],
      }
}, {
    timestamps : true
})

module.exports = mongoose.model("User", userSchema);