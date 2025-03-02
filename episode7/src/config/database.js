const mongoose = require('mongoose');

const connectDB = async () => { 
 await mongoose.connect('mongodb+srv://rakshithashetty:7GVjZwrEwPosNmlo@nodejs.algpk.mongodb.net/devTinder?retryWrites=true&w=majority')
}

module.exports = connectDB;