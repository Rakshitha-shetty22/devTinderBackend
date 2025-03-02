const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minLength: 10,
    },
    lastName: {
        type: String,
        minLength: 5,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
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
    gender : {
        type: String,
        validate(value) {       //this will only invoked only when new data is created
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    skills:{
        type:[String],
      }
}, {
    timestamps : true
})

module.exports = mongoose.model("User", userSchema);