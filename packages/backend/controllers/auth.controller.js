import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

// Tạo JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// Ẩn passwordHash, providerId khi trả user
const getUserData = (user) => {
  const { passwordHash, providerId, ...userData } = user.toJSON();
  return userData;
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { username, email, password, fullName } = req.body;

    // Kiểm tra trùng email/username
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return res.status(400).json({
        success: false,
        message: `User with ${field} already exists`,
        errors: [{ field, message: `${field} is already taken` }],
      });
    }

    const newUser = await User.create({
      username,
      email,
      passwordHash: password,
      fullName: fullName || null,
      provider: "local",
      status: "ACTIVE",
    });

    const token = generateToken(newUser.user_id, newUser.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: getUserData(newUser),
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        errors: [{ field, message: `${field} is already taken` }],
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: { [Op.or]: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Nếu tài khoản không có passwordHash (tài khoản social hoặc dữ liệu cũ), coi như invalid
    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Account is not active",
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ fields: ["lastLoginAt"] });

    const token = generateToken(user.user_id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: getUserData(user),
        token,
      },
    });


  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.json({
      success: true,
      message: "User profile",
      data: getUserData(user),
    });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
