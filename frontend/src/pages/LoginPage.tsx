import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../App";

const LoginPage = () => {
  const { handleLogin } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/login", {
        identifier,
        password,
      });
      handleLogin(response.data);
      navigate("/search");
    } catch (err) {
      console.log("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        width: "100%",
        margin: "auto",
        justifyItems: "center",
        textAlign: "center",
        gap: 2,
        marginTop: 5,
      }}
    >
      <Typography variant="h3" gutterBottom color="white">
        Welcome back!
      </Typography>
      <Typography variant="h6" gutterBottom color="white">
        Sign in to your account
      </Typography>
      <Typography variant="body2" color="white" sx={{ marginBottom: 2 }}>
        Please enter your username and password to continue.
      </Typography>

      <Box
        sx={{
          borderRadius: 2,
          padding: 2,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(139, 116, 215, 0.35)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username/Email"
            required
            autoFocus
            variant="filled"
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "rgba(67, 37, 165, 0.98)",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
            fullWidth
            margin="normal"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            autoFocus
            variant="filled"
            fullWidth
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "rgba(85, 53, 190, 0.98)",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { color: "white" },
              
            }}
          />

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "30%",
              marginTop: 2,
              marginBottom: 2,
              padding: "12px 0",
              background:
                "linear-gradient(-45deg, #FE6B8B, #FF8E53, #FE6B8B, #FF8E53)",
              backgroundSize: "400% 400%",
              ":hover": {
                backgroundPosition: "100% 50%",
                boxShadow: "0 4px 20px rgba(255, 105, 135, 0.5)",
                transform: "scale(1.05)",
              },
              animation: "gradientShift 3s ease infinite",
              "@keyframes gradientShift": {
                "0%": {
                  backgroundPosition: "0% 50%",
                },
                "50%": {
                  backgroundPosition: "100% 50%",
                },
                "100%": {
                  backgroundPosition: "0% 50%",
                },
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
