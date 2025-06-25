import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Box,
  CssBaseline,
  Typography,
  Paper,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState, createContext, useMemo, use } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";

export const ThemeContext = createContext();
export const AuthContext = createContext();

function App() {
  const [mode, setMode] = useState("light");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "rgb(51, 117, 222)" : "#rgb(5, 13, 26)",
          },
          secondary: {
            main: mode === "light" ? "rgb(87, 175, 159)" : "#rgb(30, 222, 132)",
          },
          background: {
            default: mode === "light" ? "rgb(240, 242, 245)" : "#121212",
            paper: mode === "light" ? "rgb(255, 255, 255)" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                // Dynamic background based on theme mode
                background:
                  mode === "light"
                    ? "linear-gradient(to right, rgb(87, 175, 159), rgb(119, 132, 190))"
                    : "linear-gradient(to right, #2c3e50, #34495e)", // Darker gradient for dark mode
              },
            },
          },
        },
      }),
    [mode]
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
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
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
              }}
            >
              <Header />
              <Paper
                sx={{
                  flex: 1,
                  padding: 2,
                  margin: 2,
                  backgroundColor: "background.paper",
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
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
