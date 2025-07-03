/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Search, TrendingUp } from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { keyframes } from "@emotion/react";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FavoritesPage = () => {
  const [repoAmount, setRepoAmount] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        padding: 2,
      }}
    >
      <Box>
        <Typography
          color="white"
          variant="h3"
          sx={{
            textAlign: { xs: "center", md: "left" },
            background:
              "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: `${gradientAnimation} 3s linear infinite`,
          }}
        >
          Your Favorite Repositories
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h5" color="white">
          {repoAmount} saved repositories
        </Typography>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
