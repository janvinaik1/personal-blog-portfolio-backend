const express = require("express");
const router = express.Router();
const authRoute = require("./authR");
const Blog=require("./postR");
const Portfolio= require("./portfolioR")


router.use("/",authRoute);
router.use("/blog",Blog);
router.use("/portfolio",Portfolio);

module.exports = router;