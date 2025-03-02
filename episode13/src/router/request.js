const express = require('express')
const requestRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

//to send the connection request... ignored, intrested
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

//to review the connection request... accepted, rejected..
requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try{
      //status validation...
      //raksh => xyz...
      //then xyz should be loggedIn user (i.e xyz is touserId)...
      //status should be intrested..

      const {status, requestId} = req.params;
      const allowedStatus = ["accepted", "rejected"];
      const loggenInUser = req.user;

      if(!allowedStatus.includes(status)){
        return res.status(400).send("Invalid status");
      }

      const user = await connectionRequest.findOne({
        _id: requestId,
        status: "intrested",
        toUserId: loggenInUser._id
      })

      if(!user) {
        return res.status(404).send("user not found");
      }

      user.status = status;
      await user.save();
      res.send("successfully "+status)
    }
    catch (err) {
      res.status(500).send("Error: " + err.message);
    }
})

module.exports = requestRouter;