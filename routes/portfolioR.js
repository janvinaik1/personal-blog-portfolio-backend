const Portfolio = require("../controllers/portfolioC");
const { authenticateJWT } = require("../middleware/authM");
const router = require("express").Router();
const { upload } = require("../middleware/cloudinary");

router.post(
  "/create/:id",
  authenticateJWT,
  upload.any(),
  Portfolio.createPortfolio
);
router.get("/:id", Portfolio.getPortfolio);
router.put("/:id", authenticateJWT, upload.any(), Portfolio.updatePortfolio);

router.delete("/:id", authenticateJWT, Portfolio.deletePortfolio);

module.exports = router;
