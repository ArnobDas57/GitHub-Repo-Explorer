import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Fade, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useContext } from "react";
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
        backgroundColor: "rgb(242, 242, 221)",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" color="rgb(19, 50, 61)">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="char-animation"
            style={{
              display: "inline-block",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          className="avatar-pulse"
          sx={{
            bgcolor: "rgb(121, 112, 219)",
            marginRight: 1,
          }}
        >
          <FaGithub size={25} color="white" />
          <FaSearchengin size={25} color="white" />
        </Avatar>
      </Box>
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
