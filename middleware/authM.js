const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided or invalid format. Please login." });
  }
  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log(req.user)
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
  

module.exports = { authenticateJWT,restrictTo, };
