const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, coverImage } = req.body;

    const newBlog = new Blog({
      title,
      content,
      tags,
      coverImage,
      author: req.user.id, 
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: "Error creating blog", err });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const authorId = req.query.authorId;
     if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const total = await Blog.countDocuments({ author: authorId });
    const blogs = await Blog.find({ author: authorId })
      .populate("author", "username email") 
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      blogs,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs",err });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog)
      return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to edit this blog" });

    const { title, content, tags, coverImage } = req.body;

    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.tags = tags ?? blog.tags;
    blog.coverImage = coverImage ?? blog.coverImage;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this blog" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

const search = async (req, res) => {
  try {
  if (!req.query.s) return res.status(404).json({"message":"No search string provided."})
    const blog = await Blog.find({
      $or: [
        { title: new RegExp(req.query.s, "i") },
        { content: new RegExp(req.query.s, "i") },
        { tags: new RegExp(req.query.s, "i") },
      ],
    }).populate("author", "username");
    res.status(200).json(blog);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });

  }
};

module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
  getBlogById,
  search,
};
