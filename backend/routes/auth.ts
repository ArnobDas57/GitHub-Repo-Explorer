import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import supabase from "../db";
import { verifyToken } from "../middleware/auth";

dotenv.config();

export const authRouter = express.Router();

// Interface for expected request body
interface AuthRequestBody {
  username?: string;
  email?: string;
  password: string;
  identifier?: string;
}

// Interface for Supabase User Row
interface SupabaseUser {
  user_id: string;
  username: string;
  email: string;
  password: string;
}

// POST /register
authRouter.post(
  "/register",
  verifyToken,
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("*")
        .or(
          `username.eq.${encodeURIComponent(
            username
          )},email.eq.${encodeURIComponent(email)}`
        );

      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({ username, email, password: hashedPassword })
        .select("*")
        .single();

      if (insertError || !newUser) throw insertError;

      const token = jwt.sign(
        { id: newUser.user_id, username: newUser.username },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "User registered!",
        token,
        username: newUser.username,
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// POST /login
authRouter.post("/login", verifyToken, async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email/username and password." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${identifier},email.eq.${identifier}`);

    if (error || !data || data.length === 0) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = data[0] as SupabaseUser;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});
