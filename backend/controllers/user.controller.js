const User = require("../models/User.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password_hash ");
    console.log("All users in database:", users);
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Failed to fetch users",
      error: e.message,
    });
  }
};

const clearAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    console.log("Cleared all users:", result);
    res.status(200).json({
      message: "All users cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Failed to clear users",
      error: e.message,
    });
  }
};

const userControllers = {
  getAllUsers,
  clearAllUsers,
};

module.exports = userControllers;
