const router = require('express').Router();
const auth = require("../controllers/authC");
const {loginLimiter,registerLimiter} = require("../middleware/authM")


router.post("/login",registerLimiter,auth.login);
router.post("/register",registerLimiter,auth.registerUser);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password",auth.resetPassword);


module.exports=router;
