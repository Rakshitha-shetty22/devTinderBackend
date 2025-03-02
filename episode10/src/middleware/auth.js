const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try{
        //get the token from cookie
        const { Token } = req.cookies;

        if (!Token) {
            throw new Error("Token is invalid");
        }

        //validate the token
        const decodedData = jwt.verify(Token, "devTinder@123")

        //extract the _id from decodedData
        const { _id } = decodedData;

        //get the user from _id
        const user = await User.findById(_id)

        if (!user) {
            throw new Error("User not found");
        }

        //attaching user data to req.user
        req.user = user;

        next();
    }
    catch (err) {
        res.status(400).send("Error " + err.message);
    }
}

module.exports = {userAuth}