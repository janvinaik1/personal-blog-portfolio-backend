const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided or invalid format. Please login." });
  }
  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired. Please log in again." });
    } else {
      res.status(403).json({ message: "Invalid token. Authentication failed." });
    }
  }
};

const restrictTo =(roles = [])=>(req, res, next)=>{
        if (!req.user) return res.status(401).json({message:"Token is not present please login"});
        if (!roles.includes(req.user.role)){
            return res.status(403).end("Unauthorised"); 
        } 
        next();
    };
  
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    msg: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 10 accounts/hour
  message: {
    msg: "Too many accounts created from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authenticateIfPresent = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
  } catch (err) {
    console.warn("Optional auth failed:", err.message);
   
  }

  next();
};

module.exports = { authenticateJWT,restrictTo,loginLimiter,registerLimiter,authenticateIfPresent };
