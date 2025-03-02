const express = require('express')
const requestRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

//to send the connection request...
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored","intrested"]

      const toUser = await User.findById(toUserId)

      const connectionRequests = new connectionRequest({
        fromUserId, toUserId, status
      })

      //to check wheather status is valid nd it should only ignored and intrested...
      if(!allowedStatus.includes(status)){
        throw new Error("status is invalid....");
      } 

      //to check wheather the request is already present...
      const existConnection = await connectionRequest.findOne({
        $or: [
          {fromUserId, toUserId}, //or { fromUserId: fromUserId, toUserId: toUserId },
          {toUserId, fromUserId}  //or { fromUserId: toUserId, toUserId: fromUserId }
        ]
      })

      if(existConnection) 
        throw new Error("connection request already exists...");
        
      if(!toUser) {
       throw new Error("User not found...");
      }
        await connectionRequests.save();
        res.send(`${status} request sent to ${toUser.firstName} successfully...`);
    } 
    catch (err) {
      res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter;