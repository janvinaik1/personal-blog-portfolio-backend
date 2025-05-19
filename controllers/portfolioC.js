const  Portfolio = require( "../models/Portfolio");

const getPortfolio = async (req, res) => {
  try {
    const { id:userId } = req.params;
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
    const { id:userId } = req.params;
    console.log(req.params);
    const existing = await Portfolio.findOne({ user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Portfolio already exists for this user" });
    }

    const portfolio = new Portfolio({
      ...req.body,
      user: userId,
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
    const { id:userId } = req.params;

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { ...req.body },
      { new: true }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res
      .status(200)
      .json({ message: "Portfolio updated", portfolio: updatedPortfolio });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating portfolio", error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { id:userId } = req.params;

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
  getPortfolio
};
