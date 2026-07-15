import { Response, Request } from "express";
import User from "../../schemas/user.js";
import bcrypt from "bcryptjs";
async function signUp(req: Request, res: Response) {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password) {
    res.status(400).json({
        success: false,
        message: "Name, email and password are required"
    });
    return;
}
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      res.status(400).json({
        success: false,
        message: "user already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
    return;
  }
}
export default signUp;