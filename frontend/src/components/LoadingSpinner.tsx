import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box>
      <CircularProgress size="3rem" color="success" />
    </Box>
  );
};

export default LoadingSpinner;
