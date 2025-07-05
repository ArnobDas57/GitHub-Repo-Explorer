import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import supabase from "../db/db";
import { verifyToken } from "../middleware/auth";

dotenv.config();

export const authRouter = express.Router();

interface AuthRequestBody {
  username?: string;
  email: string;
  password: string;
  identifier?: string;
}

interface PublicUserRow {
  user_id: string;
  username: string;
  email: string;
  password: string;
}

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
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET not configured");
      }

      const { data: authSignUpData, error: authSignUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authSignUpError) {
        console.error("Supabase Auth Sign Up Error:", authSignUpError);
        res.status(400).json({ message: authSignUpError.message });
        return;
      }

      const supabaseAuthUser = authSignUpData.user;

      if (!supabaseAuthUser) {
        res
          .status(500)
          .json({ message: "Failed to create user in auth system." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: newUserProfile, error: insertProfileError } = await supabase
        .from("users")
        .insert({
          user_id: supabaseAuthUser.id,
          username,
          email,
          password: hashedPassword,
        })
        .select("*")
        .single();

      if (insertProfileError || !newUserProfile) {
        console.error("Error inserting user profile:", insertProfileError);
        res.status(500).json({ message: "Failed to create user profile." });
        return;
      }

      const expiresInSeconds = parseInt(
        process.env.JWT_EXPIRES_IN || "3600",
        10
      );

      const token = jwt.sign(
        { id: supabaseAuthUser.id, username: newUserProfile.username },
        jwtSecret,
        { expiresIn: expiresInSeconds } as jwt.SignOptions
      );

      res.status(201).json({
        message: "User registered!",
        token,
        username: newUserProfile.username,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

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
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET not configured");
      }

      const { data: authSignInData, error: authSignInError } =
        await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });

      if (authSignInError) {
        console.error("Supabase Auth Sign In Error:", authSignInError);
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }

      const supabaseAuthUser = authSignInData.user;
      if (!supabaseAuthUser) {
        res
          .status(400)
          .json({ message: "Invalid credentials or user not found." });
        return;
      }

      const { data: userProfile, error: fetchProfileError } = await supabase
        .from("users")
        .select("user_id, username, email, password")
        .eq("user_id", supabaseAuthUser.id)
        .single();

      if (fetchProfileError || !userProfile) {
        console.error("Error fetching user profile:", fetchProfileError);
        res
          .status(400)
          .json({ message: "Invalid credentials or user profile missing." });
        return;
      }

      const isMatch = await bcrypt.compare(password, userProfile.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }

      const expiresInSeconds = parseInt(
        process.env.JWT_EXPIRES_IN || "3600",
        10
      );

      const token = jwt.sign(
        { id: supabaseAuthUser.id, username: userProfile.username },
        jwtSecret,
        { expiresIn: expiresInSeconds } as jwt.SignOptions
      );

      res.status(200).json({ token, username: userProfile.username });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

authRouter.get(
  "/verify",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const { data: userProfile, error } = await supabase
        .from("users")
        .select("user_id, username, email")
        .eq("user_id", userId)
        .single();

      if (error || !userProfile) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        user: {
          id: userProfile.user_id,
          username: userProfile.username,
          email: userProfile.email,
        },
      });
    } catch (error) {
      console.error("User verification error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
