import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
