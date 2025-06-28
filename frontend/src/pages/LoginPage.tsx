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

const LoginPage = () => {
  const { handleLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/login", {
        username,
        password,
      });
      handleLogin(response.data);
      navigate("/search");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
