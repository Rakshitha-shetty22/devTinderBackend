const express = require('express'); 
const connectDB = require('./config/database.js');
const User = require('./models/user.js')

const app = express();   

app.use(express.json()) //It will take json and convert into the js object to all the routes.

//--- post the signed user --//
app.post("/signup", async (req, res) => {
    const user = new User(req.body); // New instance of User Model

    try{ await user.save(); // Saving it to DB
        res.send("User created successfully");
    } catch {
        res.status(400).send('error in saving the user' + err.message)
    }
});

//--- to get the all the user who signedIN /feed ---//
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({})
        if(users.length === 0) 
            res.send("User not found")
        else 
            res.send(users)
    }
    catch {
        res.send("something went wrong")
    }
})


//--- to get the user based on filter ---//
// app.get("/feed", async (req, res) => {
//     const userName = req.body.fname;
//     try{
//         const users = await User.find({firstName: userName})
//         if(users.length === 0) 
//             res.send("User not found")
//         else 
//             res.send(users)
//     }
//     catch {
//         res.send("something went wrong")
//     }
// })


//--- delete the user --- //

app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{
        //const duser = User.findByIdAndDelete({_id: useId})
         await User.findByIdAndDelete(userId);
         res.send("user delete successfully...")
    }
    catch {
        res.send("something went wrong")
    }
})

//----update the user --- //

app.patch("/user", async(req,res)=>{
    const userId = req.body.id;
    const data = req.body;

    try{
        await User.findByIdAndUpdate({_id: userId},data)
        res.send("user deleted successfully...")
    }
    catch {
        res.send("something went wrong")
    }
})

//----update the user using options--- //
// app.patch("/user", async(req,res)=>{
//     const userId = req.body.id;
//     const data = req.body;

//     try{
//         const user = await User.findByIdAndUpdate({_id: userId},data , {returnDocument: "before"})
//         console.log(user);  //log the user before the update bez used options
//         res.send("user deleted successfully...")
//     }
//     catch {
//         res.send("something went wrong")
//     }
// })


connectDB().then (()=> {
    console.log("connection success");
    app.listen(3000, ()=>{
        console.log("server is listing the port 3000")
    })
    
}).catch (()=> {
    console.log("connection failed");
})




