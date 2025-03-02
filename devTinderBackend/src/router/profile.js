const express = require('express')
const profileRouter = express.Router();

const validator = require('validator')
const bcrypt = require('bcrypt')
const {userAuth} = require("../middleware/auth");
const { validateEditData } = require('../utils/helper');

//to get the profile...
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      res.send(req.user);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
});

// Handle the actual PATCH request for /profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user; // Extracting user from req.user
    // Replace the old data with new data using key
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/forgot/password", userAuth, async (req, res)=> {
  try{
    const { newPassword } = req.body;

    const isPasswordValid = validator.isStrongPassword(newPassword);

    if(!isPasswordValid) 
      throw new Error("Please enter strong password")
    
    else {
      const passwordHash = await bcrypt.hash(newPassword, 10);

      req.user.password = passwordHash;
      
      await req.user.save();
      res.send("Password updated successfully....")
    }
  }
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
})

module.exports = profileRouter;
