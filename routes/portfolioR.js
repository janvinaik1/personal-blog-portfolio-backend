const Portfolio = require("../controllers/portfolioC");
const { authenticateJWT } = require("../middleware/authM");
const router = require("express").Router();
const { upload } = require("../middleware/cloudinary");

router.post(
  "/create/:id",
  authenticateJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "image", maxCount: 10 },
  ]),
  Portfolio.createPortfolio
);
router.get("/:id", Portfolio.getPortfolio);
router.put(
  "/:id",
  authenticateJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "image", maxCount: 10 },
  ]),
  Portfolio.updatePortfolio
);

router.delete("/:id", authenticateJWT, Portfolio.deletePortfolio);

module.exports = router;
