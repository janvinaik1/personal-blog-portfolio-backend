const Blog=require("../controllers/postC");
const { authenticateJWT } = require("../middleware/authM");
const router = require('express').Router();

router.get("/",Blog.getAllBlogs);
router.get("/search", Blog.search);
router.get("/:id", Blog.getBlogById);
router.post("/create", authenticateJWT, Blog.createBlog);
router.put("/:id", authenticateJWT,Blog.updateBlog);
router.delete("/:id", authenticateJWT,Blog.deleteBlog);

module.exports=router;