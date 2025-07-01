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
} from "@mui/material";
import { AuthContext } from "../App";
import { Lock, Email } from "@mui/icons-material";

const RegisterPage = () => {
  const { handleLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/register", {
        username,
        email,
        password,
      });
      handleLogin(response.data);
      navigate("/search");
    } catch (err) {
      console.log("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <div>RegisterPage</div>;
};

export default RegisterPage;
