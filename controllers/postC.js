const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, readTime, coverImageUrl } = req.body;
    const coverImage = req.file?.secure_url || req.file?.path || coverImageUrl;

    console.log("req.file:", req.file);
    console.log("coverImage:", coverImage);

    const newBlog = new Blog({
      title,
      content,
      tags,
      coverImage,
      readTime,
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
    res.status(500).json({ message: "Error fetching blogs", err });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?.id;

    const blog = await Blog.findById(blogId).populate(
      "author",
      "username email"
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!userId || userId.toString() !== blog.author._id.toString()) {
      await Blog.findByIdAndUpdate(blogId, { $inc: { viewsCount: 1 } });
    }
    // console.log("UserId:", userId, "AuthorId:", blog.author._id.toString());

    const updatedBlog = await Blog.findById(blogId).populate(
      "author",
      "username email"
    );

    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching blog" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to edit this blog" });

    const {
      title,
      content,
      tags,
      readTime,
      coverImage: coverImageFromBody,
    } = req.body;

    // Use Cloudinary image if new one uploaded
    const imageUrl =
      req.file?.secure_url ||
      req.file?.path ||
      coverImageFromBody ||
      blog.coverImage;

    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.tags = tags ?? blog.tags;
    blog.coverImage = imageUrl;
    blog.readTime = readTime ?? blog.readTime;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ message: "Error updating blog", err });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

const search = async (req, res) => {
  try {
    if (!req.query.s)
      return res.status(404).json({ message: "No search string provided." });
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

const addCommentToBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, content } = req.body;

    if ( !content) {
      return res.status(400).json({ message: " comment content are required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ username, content });
    await blog.save();

    res.status(200).json({ message: "Comment added", comment: blog.comments[blog.comments.length - 1]});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
};

const deleteCommentFromBlog = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Comment deleted", comments: blog.comments });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};



module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
  getBlogById,
  search,
  addCommentToBlog,
  deleteCommentFromBlog
};
