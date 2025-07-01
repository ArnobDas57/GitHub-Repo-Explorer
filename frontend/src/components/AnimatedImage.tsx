import { Box, Typography } from "@mui/material";
import bg1 from "../assets/bg1.jpg";

const AnimatedImage = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        marginY: 2,
        padding: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom color="rgb(19, 50, 61)">
        Featured Developer Workspace
      </Typography>
      <Box
        sx={{
          display: "inline-block",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <img
          src={bg1}
          alt="Developer workspace"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            display: "block",
            animation: "float 3s ease-in-out infinite",
          }}
        />
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          }
          50% { 
            transform: translateY(-10px); 
            box-shadow: 0 18px 42px rgba(0,0,0,0.2);
          }
        }
      `}</style>
    </Box>
  );
};

export default AnimatedImage;
