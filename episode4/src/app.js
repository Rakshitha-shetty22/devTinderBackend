const express = require('express'); //importing from node modules

const app = express();   //creating the instance of express

//starting the server : This makes the application start listening for incoming HTTP requests on that port.
app.listen(3000, ()=>{
    console.log("server is listing the port 3000")
})

// --- get post delete will match the exact route---//
app.get("/user", (req,res)=>{
    res.send({"firstname": " raksh", "lastname": "shetty"});      
})

app.post("/user", (req,res)=>{
    //logic to save db here
    res.send("data saved successfully");      
})

app.delete("/user", (req,res)=>{
    res.send("data deleted successfully");      
})

//--- use will match the all like get post delete etc for same route --//
app.use("/test", (req,res)=>{
    res.send("hello haiiii");      
})

//matches abc ,ac
app.use("/ab?c", (req,res)=>{
    res.send("hello abc")
})

//matches abbbbc abbc etc
app.use("/ab+c", (req,res)=>{
    res.send("hello")
})

app.use("/abc*", (req,res)=>{
    res.send("hello")
})

app.get("/mem/:id", (req, res) => {
    console.log(req.params); 			// { userId: "111" }
    res.send("Hello");
  });

app.use("/", (req,res)=>{
    res.send("hello")
})




