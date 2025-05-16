const router = require('express').Router();
const auth = require("../controllers/authC");


router.post("/register",auth.registerUser);
router.post("/login",auth.login);


module.exports=router;
