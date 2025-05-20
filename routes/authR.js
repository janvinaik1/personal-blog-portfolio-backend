const router = require('express').Router();
const auth = require("../controllers/authC");


router.post("/register",auth.registerUser);
router.post("/login",auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password",auth.resetPassword);


module.exports=router;
