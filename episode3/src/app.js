const express = require('express'); //importing from node modules

const app = express();   //creating the instance of express

//starting the server : This makes the application start listening for incoming HTTP requests on that port.
app.listen(3000, ()=>{
    console.log("server is listing the port 3000")
})

//is called middleware in Express.js
//Define more specific routes first
app.use("/test", (req,res)=>{
    res.send("hello haiiii");      //send is used to send the response back to the client
})

// Define generic routes later
app.use("/", (req,res)=>{
    res.send("hello")
})