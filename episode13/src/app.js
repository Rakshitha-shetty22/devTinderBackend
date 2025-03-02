const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require('./router/auth.js')
const profileRouter = require('./router/profile.js')
const requestRouter = require('./router/request.js');
const userRouter = require("./router/user.js");

const app = express();

app.use(express.json()); //It will take json and convert into the js object to all the routes.
app.use(cookieParser());

app.use(authRouter)     //or app.use("/", authRouter)
app.use(profileRouter)
app.use(requestRouter)
app.use(userRouter)

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
