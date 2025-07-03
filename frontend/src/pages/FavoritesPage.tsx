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
import { Navigate, useNavigate } from "react-router-dom";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FavoritesPage = () => {
  const [repoAmount, setRepoAmount] = useState(0);

  const navigate = useNavigate();

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

      <Paper
        sx={{
          backgroundColor: "rgba(156, 116, 215, 0.28)", // Made semi-transparent
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Soft shadow
          padding: 3,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background:
              "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: `${gradientAnimation} 3s linear infinite`,
          }}
        >
          {" "}
          Discover More Repositories
        </Typography>
        <Button
          onClick={() => {
            navigate("/search");
          }}
          fullWidth
          variant="contained"
          sx={{
            height: "50px",
            backgroundColor: "rgba(186, 147, 223, 0.8)",
            color: "white",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
            flexShrink: 0,
          }}
        >
          <Search sx={{ marginRight: 0.5 }} />
          Search
        </Button>
      </Paper>
    </Box>
  );
};

export default FavoritesPage;
