import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Fade, Slide, Button } from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { FaSearchengin } from "react-icons/fa6";

// Option 1: Simple CSS Animation with keyframes
const Header = () => {
  const text = "Repo Explorer";

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

      <Fade in={true} timeout={2000} style={{ marginLeft: "auto", padding: "0 16px", marginTop: "8px" }}>
        <Box>
          <Button
            variant="text"
            sx={{
              marginLeft: "auto",
              backgroundColor: "rgba(121, 112, 219, 0)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
          <Button
            variant="text"
            sx={{
              marginLeft: 1,
              backgroundColor: "rgba(63, 56, 141, 0.92)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Register
          </Button>
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
