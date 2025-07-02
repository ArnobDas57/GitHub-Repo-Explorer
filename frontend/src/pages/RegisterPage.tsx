import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { Lock, Email, Person } from "@mui/icons-material";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axiosInstance.post("auth/register", {
        username,
        email,
        password,
      });

      if (response.status === 201 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        handleLogin(response.data);
        navigate("/search");
      } else {
        setError(
          "Registration successful, but couldn't auto-login. Please log in manually."
        );
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration error:", err);
      setError("Registration failed. Please try again.");
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
      <Typography variant="h4" gutterBottom color="white">
        Join Repo Explorer!
      </Typography>
      <Typography variant="h6" gutterBottom color="white">
        Create your account to start exploring GitHub repositories
      </Typography>

      <Box
        sx={{
          borderRadius: 2,
          padding: 2,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(84, 62, 149, 0.51)",
          boxShadow: 24,
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter your Email"
            required
            autoFocus
            variant="filled"
            InputProps={{
              style: { color: "white" },
              endAdornment: <Email sx={{ color: "white" }} />,
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Choose a Username"
            required
            autoFocus
            variant="filled"
            InputProps={{
              style: { color: "white" },
              endAdornment: <Person sx={{ color: "white" }} />,
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              endAdornment: <Lock sx={{ color: "white" }} />,
            }}
          />
          <TextField
            label="Confirm Password"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              style: { color: "white" },
              endAdornment: <Lock sx={{ color: "white" }} />,
            }}
          />

          {error && (
            <Fade in={!!error} timeout={500}>
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            </Fade>
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
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
        <Typography
          onClick={() => navigate("/register")}
          variant="body2"
          sx={{
            mt: 1,
            textAlign: "right",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "white",
            fontWeight: "normal", // Remove bold from the entire text
            "&:hover": {
              color: "rgb(236, 160, 84)",
            },
          }}
        >
          Already have an account?{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Sign in here
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
