require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const router = express.Router();

router.use(helmet());
router.use(cors({ origin: true, credentials: true }));
router.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many attempts, please try again later.",
});

// router.post("/login", authLimiter);
// router.post("/signup", authLimiter);

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Debug logging
  console.log("Signup request body:", {
    name,
    email,
    password_hash: password ? "***" : "undefined",
    role,
  });

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required",
      missing: {
        name: !name,
        email: !email,
        password_hash: !password,
        role: !role,
      },
    });
  }

  // Check if database is connected
  if (!User.db.db.admin) {
    console.error("Database not connected!");
    return res.status(500).json({ message: "Database connection error" });
  }

  try {
    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });
    console.log("Database query result:", user);

    if (user) {
      console.log("User already exists:", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    console.log("No existing user found, proceeding with signup");
    console.log(
      "About to hash password, password type:",
      typeof password,
      "length:",
      password ? password.length : "undefined"
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    const newUser = new User({
      name,
      email,
      password_hash: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);

    // Handle specific database errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: err.message,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    if (err.name === "MongoError" || err.name === "MongoServerError") {
      return res.status(500).json({
        message: "Database error",
        error: err.message,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  // Check if database is connected
  if (!User.db.db.admin) {
    console.error("Database not connected!");
    return res.status(500).json({ message: "Database connection error" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    console.log("User found:", {
      id: user._id,
      name: user.name,
      role: user.role,
    });
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });
    const responseData = {
      message: "login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    console.log("Sending login response:", responseData);
    res.status(200).json(responseData);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
