const { error } = require("console");
const express = require("express")

const { connectMongoDb } = require('./connection')
const userRouter = require("./routes/user")
const { logReqRes } = require("./middlewares");


PORT = 8000;

app = express();

//MongoDB connection
connectMongoDb('mongodb://127.0.0.1:27017/restAPI_DB');

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(logReqRes("log.txt"));

//Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log("Server Started"));
