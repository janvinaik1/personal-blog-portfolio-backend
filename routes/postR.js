const Blog = require("../controllers/postC");
const { authenticateJWT } = require("../middleware/authM");
const router = require("express").Router();
const { upload } = require("../middleware/cloudinary");

router.get("/", Blog.getAllBlogs);
router.get("/search", Blog.search);
router.get("/:id", Blog.getBlogById);
router.post(
  "/create",
  authenticateJWT,
  upload.single("image"),
  Blog.createBlog
);
router.post(
  "/upload-image",
  authenticateJWT,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = req.file?.secure_url || req.file?.path;

      res.status(200).json({ imageUrl });
    } catch (err) {
      res.status(500).json({ message: "Image upload failed", err });
    }
  }
);

router.put("/:id", authenticateJWT, upload.single("image"), Blog.updateBlog);
router.delete("/:id", authenticateJWT, Blog.deleteBlog);

module.exports = router;
