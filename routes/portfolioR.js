const Portfolio= require("../controllers/portfolioC");
const { authenticateJWT } = require("../middleware/authM");
const router = require('express').Router(); 

router.post("/create/:id", authenticateJWT, Portfolio.createPortfolio);
router.get("/:id",Portfolio.getPortfolio);
router.put("/:id", authenticateJWT,Portfolio.updatePortfolio);
router.delete("/:id", authenticateJWT,Portfolio.deletePortfolio);

module.exports=router;