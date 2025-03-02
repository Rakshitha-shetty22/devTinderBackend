const express = require('express'); //importing from node modules

const app = express();   //creating the instance of express

//starting the server : This makes the application start listening for incoming HTTP requests on that port.
app.listen(3000, ()=>{
    console.log("server is listing the port 3000")
})

app.use("/user", (req,res)=>{
    // res.send("hello")     //if u don't send the response then client will keep on wait for response.
})


//multiple route handler should have only one response back//

app.use("/test", (req, res, next) => {
    console.log("Handler 1");
    next();
}, (req, res, next) => {
    console.log("Handler 2");
    res.send("Response 2");
});

//---------use of next()--------------//
app.use("/", (req, res, next) => {
    console.log("Handler 1");
    next();
});

app.get("/users", 
    (req, res,next) => {
       next();
    },
    (req, res) => {
        res.send("Response 2");
    },
);


//-----Importance of middleware-----//

app.use("/admin", (res, req, next)=> {
    console.log("admin auth is checked");
    
    const token = "xyz";
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized) {
        res.statusCode(401).send("Unauthorized request")
    }
    else {
        next();
    }
}) //instead of checking auth again again in admin/getAllUser and /admin/deleteAllUser we can check once
//can also create the another file..

app.get("/admin/getAllUser", 
    (req, res, next) => {
        res.send("all data")
    })

app.get("/admin/deleteAllUser", 
        (req, res, next) => {
            res.send("delete all data")
        })