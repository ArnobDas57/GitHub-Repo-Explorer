import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

const SearchPage = () => {
  return (
    <Paper sx={{ backgroundColor: "rgb(200, 203, 249)" }}>
      <Typography variant="h4" gutterBottom color="rgb(19, 50, 61)" sx={{ padding: 2 }}>
        Discover GitHub Repositories
      </Typography>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search Repositories"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2, padding: 1 }}>
          Search
        </Button>
      </Box>
      <Divider sx={{ margin: 2 }} />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Search Results</Typography>
        {/* Placeholder for search results */}
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="info">
            No results found. Try a different search.
          </Alert>
        </Box>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Popular Repositories</Typography>
        {/* Placeholder for popular repositories */}
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="info">No popular repositories available.</Alert>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchPage;
