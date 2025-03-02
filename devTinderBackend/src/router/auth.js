const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//--- post the signed user --//
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, gender, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //find the user already present...
    const findUser = await User.findOne({ emailId: emailId });

    if (findUser) {
      return res.status(400).send("user already logged in please login...");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    }); // New instance of User Model
    const savedUser = await user.save(); // Saving it to DB
    //once the user signed then set the jwt token

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create the jwt token
      const token = jwt.sign({ _id: user._id }, "devTinder@123", {
        expiresIn: "1d",
      }); //we are hidding id here, nd 2nd parameter is secret key

      res.cookie("Token", token);
      res.send(savedUser);
    }
  } catch (err) {
    res.status(400).send("error in saving the user" + err.message);
  }
});

//--- login --//
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create the jwt token
      const token = jwt.sign({ _id: user._id }, "devTinder@123", {
        expiresIn: "1d",
      }); //we are hidding id here, nd 2nd parameter is secret key

      res.cookie("Token", token); //store that token in cookie

      res.send(user);
    } else throw new Error("Invalid credential");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

//--- logout ---//
authRouter.post("/logout", async (req, res) => {
  res.cookie("Token", null, { expires: new Date(0) }); //expires is required....
  res.send("logged out successfully....");
});

module.exports = authRouter;
