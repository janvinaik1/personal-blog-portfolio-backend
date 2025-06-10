require('dotenv').config();
const express = require('express');
const {connectMongoDb} = require("./connection");
const multer = require('multer');
const path = require('path');
const index = require("./routes/index")

const app = express();
const port = process.env.PORT || 3000; 

connectMongoDb();

//middleware 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});
 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/",index);

app.get("/ok", (req,res)=>{
    res.send("Okay.")
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`); 
})