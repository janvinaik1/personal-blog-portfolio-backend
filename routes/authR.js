const router = require('express').Router();
const auth = require("../controllers/authC");
const {loginLimiter,registerLimiter} = require("../middleware/authM")


router.post("/register",registerLimiter,auth.registerUser);
router.post("/login",loginLimiter,auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password",auth.resetPassword);


module.exports=router;
