import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../middleware/auth";
import supabase from "../db";

// Define interfaces for type safety
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

interface FavoriteRepoBody {
  name: string;
  desc: string;
  starCount: number;
  link: string;
  language: string;
}

interface Repository {
  repo_id?: string;
  user_id?: string;
  name: string;
  desc: string;
  starCount: number;
  link: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}

interface ErrorResponse {
  message: string;
  note?: Repository;
}

interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export const userRouter = express.Router();

// Apply verifyToken middleware to all routes in this router
userRouter.use(verifyToken);

// Save a new favorite repo
userRouter.post(
  "/favorites",
  async (req: Request, res: Response): Promise<void> => {
    const user_id: string = (req as AuthenticatedRequest).user.id;
    const { name, desc, starCount, link, language }: FavoriteRepoBody =
      req.body;

    if (!name || !desc || !starCount || !link || !language) {
      res.status(400).json({
        message:
          "Name, Description, StarCount, Link, and Language are Required",
      });
      return;
    }

    try {
      const {
        data: newRepo,
        error,
      }: { data: Repository | null; error: SupabaseError | null } =
        await supabase
          .from("repos")
          .insert([{ user_id, name, desc, starCount, link, language }])
          .select()
          .single();

      if (error) throw error;

      if (!newRepo) {
        res.status(500).json({ message: "Failed to save repository" });
        return;
      }

      res.status(201).json(newRepo);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving new favourite repository:", errorMessage);
      res.status(500).json({ message: "Failed to save repository" });
    }
  }
);

// Get user's favorite repos
userRouter.get(
  "/user/favorites",
  async (req: Request, res: Response): Promise<void> => {
    const user_id: string = (req as AuthenticatedRequest).user.id;

    try {
      const {
        data: repos,
        error,
      }: { data: Repository[] | null; error: SupabaseError | null } =
        await supabase.from("repos").select("*").eq("user_id", user_id);

      if (error) throw error;

      res.status(200).json(repos || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching repositories:", errorMessage);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  }
);

// Delete a saved repo
userRouter.delete(
  "/favorites/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { user, params } = req as AuthenticatedRequest;
    const user_id: string = user.id;
    const repo_id: string = params.id;

    try {
      const {
        data: deletedRepo,
        error,
      }: { data: Repository | null; error: SupabaseError | null } =
        await supabase
          .from("repos")
          .delete()
          .eq("user_id", user_id)
          .eq("repo_id", repo_id)
          .select()
          .single();

      if (error) throw error;

      if (!deletedRepo) {
        res
          .status(404)
          .json({ message: "Repository not found or already deleted" });
        return;
      }

      res
        .status(200)
        .json({ message: "Saved repo deleted", note: deletedRepo });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting repo:", errorMessage);
      res.status(500).json({ message: "Failed to delete saved repo" });
    }
  }
);
