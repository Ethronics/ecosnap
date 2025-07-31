const User = require("../models/User.js");
const Company = require("../models/Company.js");
const bcrypt = require("bcrypt");

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

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }

    // Validate role
    const validRoles = ["admin", "manager", "staff", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role. Must be one of: admin, manager, staff, employee",
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = new User({
      name,
      email,
      password_hash,
      role,
    });

    const savedUser = await user.save();

    // Get the manager's company and add the user to employees array
    const managerId = req.user.userId; // From JWT token
    const company = await Company.findOne({
      "manager.reference": managerId,
    });

    if (company) {
      // Add the new user to the company's employees array
      company.employees.push({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      });
      await company.save();
    }

    // Return user data without password
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      created_at: savedUser.created_at,
    };

    res.status(201).json({
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password_hash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If password is being updated, hash it
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(
        updateData.password,
        saltRounds
      );
      delete updateData.password; // Remove plain password from update data
    }

    // Validate role if it's being updated
    if (updateData.role) {
      const validRoles = ["admin", "manager", "staff", "employee"];
      if (!validRoles.includes(updateData.role)) {
        return res.status(400).json({
          message:
            "Invalid role. Must be one of: admin, manager, staff, employee",
        });
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password_hash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
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
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  clearAllUsers,
};

module.exports = userControllers;
