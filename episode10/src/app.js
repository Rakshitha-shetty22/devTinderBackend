const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/auth")

const app = express();

app.use(express.json()); //It will take json and convert into the js object to all the routes.
app.use(cookieParser());

//--- post the signed user --//
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, gender, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    }); // New instance of User Model
    await user.save(); // Saving it to DB
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("error in saving the user" + err.message);
  }
});

//--- login --//
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create the jwt token
      const token = jwt.sign({ _id: user._id }, "devTinder@123", {expiresIn: "1d"}); //we are hidding id here, nd 2nd parameter is secret key

      res.cookie("Token", token); //store that token in cookie

      res.send("Login successfully....");

    } else throw new Error("Invalid credential");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

//to get the profile...
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

//to send the connection request...
app.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try {
    res.send(req.user.firstName + " sent the connection request");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("connection success");
    app.listen(3000, () => {
      console.log("server is listing the port 3000");
    });
  })
  .catch((err) => {
    console.error("Connection failed: " + err.message);
  });
