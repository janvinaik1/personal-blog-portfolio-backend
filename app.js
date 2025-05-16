require('dotenv').config();
const express = require('express');
const cors= require('cors');
const {connectMongoDb} = require("./connection");
const path = require('path');
const index = require("./routes/index")

const app = express();// initialize express
const port = process.env.PORT ;

connectMongoDb();// connect db

//middleware 
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Body parser
app.use(express.urlencoded({ extended: true }));

app.use("/",index);
app.listen(port,()=>{
    console.log('Server running on port ${PORT}');
})