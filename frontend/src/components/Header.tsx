import { Box, Typography, Avatar, Fade, Button } from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { FaSearchengin } from "react-icons/fa6";
import { Logout, Search, Favorite } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";

const Header = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user, handleLogout, isLoading } =
    useContext(AuthContext);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const text = "Repo Explorer";

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const getFirstLetter = (text: string) => {
    return text ? text.charAt(0).toUpperCase() : "";
  };

  return (
    <Box
      sx={{
        padding: 2,
        gap: 1,
        backgroundColor: "transparent",
        justifyContent: "left",
        display: "flex",
        alignItems: "left",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          className="avatar-pulse"
          sx={{
            bgcolor: "rgb(133, 126, 202)",
            marginRight: 1,
          }}
        >
          <FaGithub size={25} color="white" />
          <FaSearchengin size={25} color="white" />
        </Avatar>
      </Box>

      <Link
        to={isAuthenticated ? "/search" : "/login"}
        style={{ textDecoration: "none", color: "white" }}
      >
        <Typography variant="h4" color="rgb(235, 221, 255)">
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="char-animation"
              style={{
                display: "inline-block",
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </Typography>
      </Link>

      <Box>
        {isAuthenticated ? (
          <Box
            sx={{
              marginLeft: 5,
              marginTop: 1.3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={() => navigate("/search")}
              variant="text"
              sx={{
                backgroundColor: "rgba(63, 56, 141, 0.92)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgba(63, 56, 141, 1)",
                },
              }}
            >
              <Search sx={{ marginRight: 0.5 }} />
              Search
            </Button>
            <Button
              onClick={() => navigate("/favorites")}
              variant="text"
              sx={{
                marginleft: 2,
                backgroundColor: "rgba(63, 56, 141, 0.92)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgba(63, 56, 141, 1)",
                },
              }}
            >
              <Favorite sx={{ marginRight: 0.5 }} />
              Favorite Repositories
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>

      <Fade
        in={true}
        timeout={2000}
        style={{ marginLeft: "auto", padding: "0 16px", marginTop: "8px" }}
      >
        <Box>
          {isAuthenticated ? (
            // Show user info and logout when authenticated
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "rgb(121, 112, 219)",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                }}
              >
                {getFirstLetter(user?.username || "")}
              </Avatar>
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "medium" }}
              >
                {user?.username}
              </Typography>
              <Button
                onClick={handleLogoutClick}
                variant="text"
                sx={{
                  backgroundColor: "rgba(63, 56, 141, 0.92)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(63, 56, 141, 1)",
                  },
                }}
              >
                Logout
                <Logout sx={{ marginLeft: 1 }} />
              </Button>
            </Box>
          ) : (
            // Show login/register buttons when not authenticated
            <Box>
              <Button
                onClick={() => navigate("/login")}
                variant="text"
                sx={{
                  marginLeft: "auto",
                  backgroundColor: "rgba(121, 112, 219, 0)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(121, 112, 219, 0.1)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="text"
                sx={{
                  marginLeft: 1,
                  backgroundColor: "rgba(63, 56, 141, 0.92)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(63, 56, 141, 1)",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Fade>

      <style>{`
        .char-animation {
          animation: fadeInUpContinuous 4s ease infinite;
        }
        
        .avatar-pulse {
          animation: avatarPulse 2s ease-in-out infinite;
        }
        
        @keyframes fadeInUpContinuous {
          0%, 20% {
            opacity: 0;
            transform: translateY(20px);
          }
          30%, 70% {
            opacity: 1;
            transform: translateY(0);
          }
          80%, 100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        @keyframes avatarPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(121, 112, 219, 0.7);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(121, 112, 219, 0);
          }
        }
      `}</style>
    </Box>
  );
};

export default Header;
