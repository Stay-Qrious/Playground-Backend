const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter, passwordRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const initializeSocket = require("./utils/socket");




app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", passwordRouter);
app.use("/", userRouter);







app.use("/", (err, req, res, next) => {
    res.send("matching ka mila hi nhi  !");
})

initializeSocket(server);


connectDB.then(() => {
    console.log("Database connected successfully");
   server.listen(3000, "0.0.0.0", () => { 
  console.log("Server started at port 3000"); 
});

});





