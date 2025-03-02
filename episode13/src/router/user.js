const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

//to find all pending request to approval...
userRouter.get("/user/requests", userAuth , async(req, res) => {
    try{
        const loggedInUser = req.user;

        const pendingRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "intrested"
        }).populate("fromUserId", ["firstName", "lastName", "skills"])  //populating.....

        const requestCount = pendingRequests.length;

        if(!requestCount) 
            return res.status(404).send("No pending request found...")

        res.json({       //can also send the response in json format
            message: "The pending requests are: " + requestCount,
            data: pendingRequests
        });
    }
    catch (err) {
        res.status(500).send("Error: " + err.message);
    }
})

//to find all the connections......
userRouter.get("/user/connections", userAuth, async(req, res)=> {
    try{
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({ 
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "skills"])
          .populate("toUserId", ["firstName", "lastName", "skills"]) 

        const requestCount = connections.length;

        if(!requestCount) 
            return res.status(404).send("No pending request found...")

        const data = connections.map((i)=> {
            if(i.fromUserId.equals(loggedInUser._id))
                return i.toUserId;
            else
                return i.fromUserId;
        })

        res.json({       //can also send the response in json format
            message: "The your connections are: " + requestCount,
            data: data
        });
    }
    catch (err) {
        res.status(500).send("Error: " + err.message);
    }
})


module.exports = userRouter;