import { Request, Response } from "express";
import User from "../../schemas/user.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "both email and password are required",
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid email",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}
