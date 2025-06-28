import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL: string | undefined = process.env.SUPABASE_URL;
const SUPABASE_KEY: string | undefined =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables.");
}

// Optional debuggin logs
console.log("Supabase URL:", SUPABASE_URL);
console.log(
  "Using Service Role Key:",
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;