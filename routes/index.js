const express = require("express");
const router = express.Router();
const authRoute = require("./authR");
const Blog=require("./postR");


router.use("/",authRoute);
router.use("/blog",Blog);

module.exports = router;