const express = require('express'); 
const connectDB = require('./config/database.js');
const User = require('./models/user.js')
const bcrypt = require('bcrypt')

const app = express();   

app.use(express.json()) //It will take json and convert into the js object to all the routes.

//--- post the signed user --//
app.post("/signup", async (req, res) => {
    try{ 
        const {firstName, lastName, emailId,gender, password, } = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({firstName, lastName, emailId, gender, password:passwordHash }); // New instance of User Model
        await user.save(); // Saving it to DB
        res.send("User created successfully");
    } catch(err) {
        res.status(400).send('error in saving the user' + err.message)
    }
});

//--- login --//
app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId})
        if(!user) {
            throw new Error("Invalid credential");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

       
        
        if(!isPasswordValid) {
            throw new Error("Invalid credential");
        }
        else
            res.send("Login successfully....");
    }
    catch(err) {
        res.status(400).send('Error ' + err.message)
    }
});


//--- to get the all the user who signedIN /feed ---//
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({})
        if(users.length === 0) 
            res.status(404).send("User not found")
        else 
            res.send(users)
    }
    catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
})

//--- to get the user based on filter ---//
// app.get("/feed", async (req, res) => {
//     const userName = req.body.fname;
//     try{
//         const users = await User.find({firstName: userName})
//         if(users.length === 0) 
//             res.status(404).send("User not found")
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

app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
        //allowing only certain fields to update and no new fields...
        const allowedFields = ["firstName", "lastName", "gender", "skills"];

        const isUpdatedAllowed = Object.keys(data).every((k)=>allowedFields.includes(k));

        if(!isUpdatedAllowed) {
            throw new Error("Update not allowed..")
        }
        
        //skill not more than 10..
        if(data.skills.length >10) {
            throw new Error("skills not more than 10..")
        }

        await User.findByIdAndUpdate({_id: userId},data, {runValidators: true})     
        //here i have used option (runvalidators) becz to invoke validation when er are updating  
        res.send("user updated successfully...")
    }
    catch(err) {
        res.status(400).send("update failed " + err.message)
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
    
}).catch((err) => {
    console.error("Connection failed: " + err.message);
});




