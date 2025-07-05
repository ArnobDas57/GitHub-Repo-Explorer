import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Box,
  Alert,
  CircularProgress, // For loading indicator
  type Theme, // Import Theme type for createTheme return type
} from "@mui/material";

// Import your pages
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import FavoritesPage from "../pages/FavoritesPage";
import SearchPage from "../pages/SearchPage";

// Import your AuthContext
import { AuthContext } from "../contexts/AuthContext";

// Define props for AuthConditionalRoutes component
interface AuthConditionalRoutesProps {
  theme: Theme; // Use the imported Theme type
}

const AuthConditionalRoutes = ({ theme }: AuthConditionalRoutesProps) => {
  // Consume the authentication context
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Display a loading indicator while authentication status is being determined
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px", // Adjust height as needed
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Routes */}
      <Route
        path="/search"
        element={
          isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/favorites"
        element={
          isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" replace />
        }
      />

      {/* Default redirect based on authentication status */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/search" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Not Found Route */}
      <Route
        path="*"
        element={
          <Box
            sx={{
              p: 2,
              width: 250,
              mx: "auto",
              mt: 5,
              borderRadius: "4px",
              backgroundColor: theme.palette.background.paper,
              textAlign: "center",
            }}
          >
            <Alert variant="filled" severity="error">
              404 - Page Not Found
            </Alert>
          </Box>
        }
      />
    </Routes>
  );
};

export default AuthConditionalRoutes;
