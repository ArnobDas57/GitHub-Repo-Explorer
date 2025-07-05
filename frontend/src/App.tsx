/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserRouter as Router } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Paper,
  ThemeProvider,
  createTheme,
  Divider,
} from "@mui/material";
import { useMemo } from "react";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthContext itself
import AuthConditionalRoutes from "./routing/AuthConditionalRoutes";

function App() {
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
                overflowY: "scroll",
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

  return (
    <Router>
      <AuthProvider>
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
            <Divider
              sx={{ margin: 5, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            <Paper
              sx={{
                flex: 1,
                backgroundColor: "transparent",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <AuthConditionalRoutes theme={theme} />
            </Paper>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
