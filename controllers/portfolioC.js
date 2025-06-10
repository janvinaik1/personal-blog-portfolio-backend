const Portfolio = require("../models/Portfolio");

const getPortfolio = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const portfolio = await Portfolio.findOne({ user: userId }).populate(
      "user",
      "username email"
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching portfolio", error: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const existing = await Portfolio.findOne({ user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Portfolio already exists for this user" });
    }

    let avatarUrl = "";
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      avatarUrl = req.files.avatar[0].path;
    } else if (
      typeof req.body.avatar === "string" &&
      req.body.avatar.trim() !== ""
    ) {
      avatarUrl = req.body.avatar;
    }

    const image = req.files?.image || [];
    const projects = req.body.projects || "[]";

    projects.forEach((project, index) => {
      if (image[index]) {
        project.image = image[index].path;
      }
    });

    const portfolio = new Portfolio({
      ...req.body,
      avatar: avatarUrl,
      showBlogs: req.body.wantsBlog,
      user: userId,
      projects,
    });

    await portfolio.save();

    res.status(201).json({ message: "Portfolio created", portfolio });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating portfolio", error: error.message });
  }
};


const updatePortfolio = async (req, res) => {
  try {
    const { id: userId } = req.params;

    let avatarUrl = "";
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      avatarUrl = req.files.avatar[0].path;
    } else if (
      typeof req.body.avatar === "string" &&
      req.body.avatar.trim() !== ""
    ) {
      avatarUrl = req.body.avatar;
    }

    const image = req.files?.image || [];

    let projects = [];
    if (typeof req.body.projects === "string") {
      try {
        projects = JSON.parse(req.body.projects);
      } catch (err) {
        return res.status(400).json({ message: "Invalid projects JSON format" });
      }
    } else {
      projects = req.body.projects || [];
    }

    // Attach images to each project (if any)
    projects.forEach((project, index) => {
      if (image[index]) {
        project.image = image[index].path;
      }
    });

    const updateData = {
      ...req.body,
      avatar: avatarUrl,
      showBlogs: req.body.wantsBlog,
      projects,
    };

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({
      message: "Portfolio updated",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating portfolio",
      error: error.message,
    });
  }
};


const deletePortfolio = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const deleted = await Portfolio.findOneAndDelete({ user: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting portfolio", error: error.message });
  }
};

module.exports = {
  deletePortfolio,
  updatePortfolio,
  createPortfolio,
  getPortfolio,
};
