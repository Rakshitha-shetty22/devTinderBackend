const express = require('express')
const requestRouter = express.Router();

const {userAuth} = require("../middleware/auth")

//to send the connection request...
requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try {
      res.send(req.user.firstName + " sent the connection request");
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
});

module.exports = requestRouter;