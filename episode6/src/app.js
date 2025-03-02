const express = require('express'); 
const connectDB = require('./config/database.js');
const User = require('./models/user.js')

const app = express();   

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "raksh shetty",
        lastName: "shetty",
        email: "test@gmail.com",
        password: "abcdef"
    }); // New instance of User Model

    try{ await user.save(); // Saving it to DB
        res.send("User created successfully");
    } catch {
        res.status(400).send('error in saving the user' + err.message)
    }
   
});

connectDB().then (()=> {
    console.log("connection success");
    app.listen(3000, ()=>{
        console.log("server is listing the port 3000")
    })
    
}).catch (()=> {
    console.log("connection failed");
})




