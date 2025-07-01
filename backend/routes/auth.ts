import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import supabase from "../db";

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

// POST /register - REMOVED verifyToken middleware (registration should be public)
authRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body as AuthRequestBody;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Please enter all fields." });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
      return;
    }

    try {
      // Check JWT_SECRET exists
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET not configured");
      }

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
        res.status(400).json({ message: "User already exists." });
        return;
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
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
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

// POST /login - REMOVED verifyToken middleware (login should be public)
authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    const { identifier, password } = req.body as AuthRequestBody;

    if (!identifier || !password) {
      res
        .status(400)
        .json({ message: "Please provide both email/username and password." });
      return;
    }

    try {
      // Check JWT_SECRET exists
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET not configured");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`username.eq.${identifier},email.eq.${identifier}`);

      if (error || !data || data.length === 0) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }

      const user = data[0] as SupabaseUser;
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }

      const token = jwt.sign(
        { id: user.user_id, username: user.username },
        jwtSecret as string,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      res.status(200).json({ token, username: user.username });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);
