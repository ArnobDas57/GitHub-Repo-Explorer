import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../middleware/auth";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

interface FavoriteRepoBody {
  repo_id?: string;
  user_id?: string;
  name: string;
  description: string;
  starCount: number;
  link: string;
  language: string;
  owner?: {
    login: string;
    avatar_url: string;
  };
}

interface Repository {
  repo_id?: string;
  user_id?: string;
  name: string;
  description: string;
  starCount: number;
  link: string;
  language: string;
  created_at?: string;
  updated_at?: string;
  owner?: {
    login: string;
    avatar_url: string;
  };
}

interface SupabaseError {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
}

export const userRouter = express.Router();

userRouter.use(verifyToken);

// Helper function to create an authenticated Supabase client for the request
const createAuthSupabaseClient = (req: Request): SupabaseClient => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("Authentication token missing.");
  }

  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseServiceRoleKey = process.env
    .SUPABASE_SERVICE_ROLE_KEY as string; // Or process.env.SUPABASE_ANON_KEY if you didn't rename it on Render

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

userRouter.post(
  "/favorites",
  async (req: Request, res: Response): Promise<void> => {
    const user_id: string = (req as AuthenticatedRequest).user.id;
    const {
      name,
      description,
      starCount,
      link,
      language,
      owner,
    }: FavoriteRepoBody = req.body;

    const owner_login = owner?.login;
    const owner_avatar_url = owner?.avatar_url;

    console.log("Backend received req.body:", req.body);

    if (
      !name ||
      name.trim().length === 0 ||
      !link ||
      link.trim().length === 0 ||
      typeof starCount !== "number" ||
      starCount < 0
    ) {
      res.status(400).json({
        message: "Name, Link, and StarCount are required and must be valid.",
      });
      return;
    }

    try {
      const userSupabase = createAuthSupabaseClient(req);

      const {
        data: newRepo,
        error,
      }: { data: Repository | null; error: SupabaseError | null } =
        await userSupabase
          .from("repos")
          .insert([
            {
              user_id,
              name,
              description,
              starCount,
              link,
              language,
              owner_login,
              owner_avatar_url,
            },
          ])
          .select()
          .single();

      if (error) throw error;

      if (!newRepo) {
        res.status(500).json({ message: "Failed to save repository" });
        return;
      }

      res.status(201).json(newRepo);
    } catch (error: unknown) {
      console.error("Error saving new favourite repository:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error &&
        error.code === "23505"
      ) {
        res
          .status(409)
          .json({ message: "This repository is already in your favorites." });
      } else {
        res.status(500).json({ message: "Failed to save repository" });
      }
    }
  }
);

userRouter.get(
  "/favorites",
  async (req: Request, res: Response): Promise<void> => {
    const user_id: string = (req as AuthenticatedRequest).user.id;

    try {
      const userSupabase = createAuthSupabaseClient(req);

      const {
        data: repos,
        error,
      }: { data: Repository[] | null; error: SupabaseError | null } =
        await userSupabase.from("repos").select("*").eq("user_id", user_id);

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

userRouter.delete(
  "/favorites/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { user, params } = req as AuthenticatedRequest;
    const user_id: string = user.id;
    const repo_id: string = params.id;

    try {
      const userSupabase = createAuthSupabaseClient(req);

      const {
        data: deletedRepo,
        error,
      }: { data: Repository | null; error: SupabaseError | null } =
        await userSupabase
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
