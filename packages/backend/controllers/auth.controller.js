import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const generateTokens = (userId, role, rememberMe = false) => {

  const accessTokenExpiry = rememberMe ? '30d': '4h';

  const accessToken = jwt.sign(
    {
      sub: userId,
      role,
      type: "access",
      rememberMe
    },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiry}
  );

  let refreshToken = null ;
  if(rememberMe )  {
    refreshToken = jwt.sign(
      {
        sub: userId,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }
  return {accessToken, refreshToken, expiresIn: accessTokenExpiry};
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

    const { username, email, password, fullName, phone } = req.body;

    // Kiểm tra trùng email/username
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }, {phone}] },
    });

    if (existingUser) {
      let field, message;
      if (existingUser.email === email) {
        field = "email";
        message = "Email đã tồn tại";
      } else if (existingUser.username === username) {
        field = "username";
        message = "Username đã tồn tại";
      } else if (existingUser.phone === phone) {
        field = "phone";
        message = "Số điện thoại đã tồn tại";
      }
      
      return res.status(400).json({
        success: false,
        message: message,
        errors: [{ field, message }],
      });
    }

    const newUser = await User.create({
      username,
      email,
      phone: phone || null,
      passwordHash: password,
      fullName: fullName || null,
      provider: "local",
      status: "ACTIVE",
    });

    const { accessToken, refreshToken } = generateTokens(newUser.user_id, newUser.role, false);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: getUserData(newUser),
        token: accessToken,
        ...(refreshToken ? { refreshToken } : {}),
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
    const { identifier, password, rememberMe = false } = req.body;

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

    const { accessToken, refreshToken } = generateTokens(user.user_id, user.role, rememberMe);

    const responseData = {
      user: getUserData(user),
      token: accessToken,
      ...(refreshToken ? { refreshToken } : {}),
      rememberMe,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: responseData,
    });


  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// new endpoint for refresh Token 
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (payload.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const user = await User.findByPk(payload.sub);
    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    // On refresh, issue a new access token and rotate refresh token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.user_id,
      user.role,
      true
    );

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: accessToken,
        refreshToken: newRefreshToken,
        user: getUserData(user),
      },
    });
  } catch (error) {
    console.error("Refresh token error in auth.controller:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
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

// Kiểm tra username đã tồn tại
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const existingUser = await User.findOne({
      where: { username },
    });

    return res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Username đã tồn tại" : "Username có thể sử dụng",
    });
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Kiểm tra email đã tồn tại
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    return res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Email đã tồn tại" : "Email có thể sử dụng",
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Kiểm tra phone đã tồn tại
export const checkPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const existingUser = await User.findOne({
      where: { phone },
    });

    return res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Số điện thoại đã tồn tại" : "Số điện thoại có thể sử dụng",
    });
  } catch (error) {
    console.error("Check phone error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
