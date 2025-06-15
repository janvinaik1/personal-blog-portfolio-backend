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
      return res.status(400).json({ message: "Portfolio already exists for this user" });
    }

    // Map uploaded files by field name
    const filesMap = {};
    req.files.forEach((file) => {
      filesMap[file.fieldname] = file.path;
    });

    // Handle avatar
    let avatarUrl = "";
    if (filesMap["avatar"]) {
      avatarUrl = filesMap["avatar"];
    } else if (typeof req.body.avatar === "string" && req.body.avatar.trim() !== "") {
      avatarUrl = req.body.avatar;
    }

    // Parse projects
    let projects = [];
    if (req.body.projects) {
      try {
        const parsedProjects = JSON.parse(req.body.projects);
        projects = parsedProjects.map((project, index) => {
          const fieldKey = `projects[${index}][image]`;
          return {
            ...project,
            image: filesMap[fieldKey] || "",
          };
        });
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON format in projects field" });
      }
    }

    const portfolio = new Portfolio({
      ...req.body,
      avatar: avatarUrl,
      wantsBlog: req.body.wantsBlog === "true", // ensure it's boolean
      user: userId,
      projects,
    });

    await portfolio.save();

    res.status(201).json({ message: "Portfolio created", portfolio });
  } catch (error) {
    res.status(500).json({ message: "Error creating portfolio", error: error.message });
  }
};


const updatePortfolio = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Map uploaded files by field name
    const filesMap = {};
    if (req.files) {
      req.files.forEach((file) => {
        filesMap[file.fieldname] = file.path;
      });
    }

    // Handle avatar
    let avatarUrl = "";
    if (filesMap["avatar"]) {
      avatarUrl = filesMap["avatar"];
    } else if (typeof req.body.avatar === "string" && req.body.avatar.trim() !== "") {
      avatarUrl = req.body.avatar;
    }

    // Parse projects
    let projects = [];
    if (req.body.projects) {
      if (typeof req.body.projects === "string") {
        // If it's a string, parse it as JSON
        try {
          const parsedProjects = JSON.parse(req.body.projects);
          projects = parsedProjects.map((project, index) => {
            const fieldKey = `projects[${index}][image]`;
            return {
              ...project,
              image: filesMap[fieldKey] || project.image || "", // Keep existing image if no new one
            };
          });
        } catch (e) {
          return res.status(400).json({ message: "Invalid JSON format in projects field" });
        }
      } else if (Array.isArray(req.body.projects)) {
        // If it's already an array, use it directly
        projects = req.body.projects.map((project, index) => {
          const fieldKey = `projects[${index}][image]`;
          return {
            ...project,
            image: filesMap[fieldKey] || project.image || "", // Keep existing image if no new one
          };
        });
      }
    }

    const updateData = {
      name: req.body.name,
      title: req.body.title,
      bio: req.body.bio,
      contactEmail: req.body.contactEmail,
      avatar: avatarUrl,
      showBlogs: req.body.wantsBlog === "true" || req.body.wantsBlog === true,
      projects,
      skills: req.body.skills || [],
      experience: req.body.experience || [],
      education: req.body.education || [],
      socialLinks: req.body.socialLinks || [],
      contact: req.body.contact || {},
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
