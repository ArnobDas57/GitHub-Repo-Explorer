/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Box,
  CssBaseline,
  Paper,
  Alert,
  ThemeProvider,
  createTheme,
  Divider,
  Fade
} from "@mui/material";
import { useEffect, useState, createContext, useMemo } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#1e4890",
          },
          secondary: {
            main: "#a6dad0",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                padding: 0,
                minHeight: "100vh",
                overflow: "hidden",
              },
              // Create animated wave background
              "@keyframes waveAnimation": {
                "0%": {
                  transform: "translateX(0) translateY(0) scale(1)",
                },
                "33%": {
                  transform: "translateX(-20px) translateY(-10px) scale(1.02)",
                },
                "66%": {
                  transform: "translateX(10px) translateY(5px) scale(0.98)",
                },
                "100%": {
                  transform: "translateX(0) translateY(0) scale(1)",
                },
              },
              "@keyframes waveAnimation2": {
                "0%": {
                  transform: "translateX(0) translateY(0) scale(1.01)",
                },
                "50%": {
                  transform: "translateX(15px) translateY(-8px) scale(0.99)",
                },
                "100%": {
                  transform: "translateX(0) translateY(0) scale(1.01)",
                },
              },
            },
          },
        },
      }),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setUser(storedUsername);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (userData) => {
    if (userData && userData.username) {
      setUser(userData.username);
      setIsAuthenticated(true);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("username", userData.username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{ user, isAuthenticated, handleLogin, handleLogout }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              position: "relative",
              // Animated background layers
              "&::before": {
                content: '""',
                position: "fixed",
                top: "-10%",
                left: "-10%",
                right: "-10%",
                bottom: "-10%",
                backgroundImage: `url('/assets/bg1.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                animation: "waveAnimation 8s ease-in-out infinite",
                zIndex: -2,
              },
              "&::after": {
                content: '""',
                position: "fixed",
                top: "-10%",
                left: "-10%",
                right: "-10%",
                bottom: "-10%",
                backgroundImage: `url('/assets/bg1.jpg')`,
                backgroundSize: "105% 105%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.3,
                animation: "waveAnimation2 12s ease-in-out infinite reverse",
                zIndex: -1,
              },
            }}
          >
            <Header />
            <Divider sx={{ margin: 2, backgroundColor: "rgba(255, 255, 255, 0.3)" }} />
            <Paper
              sx={{
                flex: 1,
                padding: 2,
                margin: 2,
                backgroundColor: "transparent",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
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
            </Paper>
          </Box>
        </ThemeProvider>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
