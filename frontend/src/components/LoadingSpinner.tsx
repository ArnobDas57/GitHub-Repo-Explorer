import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "blue",
      }}
    >
      <CircularProgress sx={{ color: "white" }} />
    </Box>
  );
};

export default LoadingSpinner;
