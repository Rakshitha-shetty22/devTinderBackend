const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

//to find all pending request to approval...
userRouter.get("/user/requests", userAuth , async(req, res) => {
    try{
        const loggedInUser = req.user;

        const pendingRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "intrested"
        }).populate("fromUserId", ["firstName", "lastName", "skills", "photoUrl"])  //populating.....

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
        }).populate("fromUserId", ["firstName", "lastName", "skills", "photoUrl"])
          .populate("toUserId", ["firstName", "lastName", "skills",  "photoUrl"]) 

        const requestCount = connections.length;

        if(!requestCount) 
            return res.status(404).send("No connection found...")

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
        res.status(400).send("Error: " + err.message);
    }
})

//to get all the user feed Api....
userRouter.get("/user/feed", userAuth, async(req, res)=> {
    try{
        //user should see the all card except
            //--his own card
            //--his connection
            //--card that he ignored
            //--already sent connection request

        //pagination
            //feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
            //feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
            //feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)


        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;    //query params difference in notes...
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50: limit;
        const skip = (page-1)*limit;
      
        //get all the connections
        const connections = await connectionRequest.find({ 
            $or: [
                { toUserId: loggedInUser._id},
                { fromUserId: loggedInUser._id}
            ]
        }).select("fromUserId  toUserId");

        //set is used to eliminate the dublicate.... [1,2,4,1] => [1,2,4]
        const hideUser = new Set();
        //adding all id to the set and it will give the unique ids
        connections.forEach((i)=> {
            hideUser.add(i.fromUserId.toString());
            hideUser.add(i.toUserId.toString());
        })
        
        //once we got all the id then we are filtering the id that not in the set...
        const feed = await User.find({
                        //here we are convering the set into array
                        $and: [
                            { _id: { $nin: Array.from(hideUser) } },
                            { _id: { $ne: loggedInUser._id } },
                          ],
        }).select("firstName lastName skills photoUrl")  //select is used to get required fields...
          .skip(skip)
          .limit(limit)

        res.send(feed)
    }
    catch (err) {
        res.status(500).send("Error: " + err.message);
    }
})

module.exports = userRouter;

