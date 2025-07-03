import { Suspense } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Search, TrendingUp } from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { keyframes } from "@emotion/react";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function MeshyModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1} />;
}

function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: "200px",
        height: "200px",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: false,
          powerPreference: "default",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.log("WebGL context lost");
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored");
          });
        }}
      >
        {/* Simplified lighting */}
        <ambientLight intensity={2} />

        {/* Your Meshy model */}
        <Suspense fallback={null}>
          <MeshyModel modelPath={modelPath} />
        </Suspense>

        {/* Controls to rotate/zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Canvas>
    </Box>
  );
}

const SearchPage = () => {
  return (
    <Box>
      <Paper
        sx={{
          backgroundColor: "rgba(156, 116, 215, 0.28)", // Made semi-transparent
          backdropFilter: "blur(10px)", // Added blur effect
          border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Soft shadow
          padding: 2,
          borderRadius: 2,
          width: "100%",
          maxWidth: 1000,
          margin: "auto",
        }}
      >
        {/* Header section with Typography and 3D Model side by side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Distribute space between items
            flexWrap: "wrap", // Allow items to wrap on smaller screens
            marginBottom: 2, // Add some space below the header section
          }}
        >
          {/* Text Section */}
          <Box sx={{ marginLeft: 2 }}>
            <Fade in={true} timeout={1000}>
              <Typography
                variant="h4"
                color="rgb(255, 255, 255)"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  background:
                    "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200% auto",
                  animation: `${gradientAnimation} 3s linear infinite`,
                }}
              >
                Discover GitHub Repositories
              </Typography>
            </Fade>
          </Box>

          {/* 3D Model Section */}
          <Box
            sx={{
              flexShrink: 0,
              marginLeft: { xs: 0, md: 2 },
              marginTop: { xs: 2, md: 0 },
            }}
          >
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    width: "200px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(5px)",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexDirection: "column",
                  }}
                >
                  <CircularProgress size={30} />
                </Box>
              }
            >
              <ModelViewer modelPath="/models/purple_Github_logo_wi_0630153742_texture.glb" />
            </Suspense>
          </Box>
        </Box>

        {/* Description Section (adjusted based on image layout) */}
        <Box
          sx={{
            ml: { xs: 0, md: 2 },
            textAlign: { xs: "center", md: "left" },
            mb: 5,
          }}
        >
          <Typography variant="h6" color="rgb(255, 255, 255)">
            Search for any GitHub user and explore their public repositories.
            Save your favorites and keep track of interesting projects.
          </Typography>
        </Box>

        <Divider
          sx={{ margin: 5, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        />

        {/* New: Search GitHub User Section */}
        <Box sx={{ padding: 2 }}>
          {/* Top heading: Search GitHub User with icon */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FaGithub
              style={{ color: "white", fontSize: "24px", marginRight: "8px" }}
            />
            <Typography
              variant="h6"
              sx={{
                background:
                  "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                animation: `${gradientAnimation} 3s linear infinite`,
                color: "white",
              }}
            >
              Search GitHub User
            </Typography>
          </Box>

          {/* Search Input Field and Button Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3, // Margin bottom for spacing with popular users
              flexWrap: "wrap", // Allow wrapping on small screens
            }}
          >
            <TextField
              label="GitHub Username" // Label above the input
              placeholder="Enter GitHub username (e.g., octocat)" // Placeholder text inside
              variant="outlined"
              margin="none" // Remove default TextField vertical margins for precise control
              sx={{
                flexGrow: 1, // Allows TextField to take remaining space
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)", // Almost white background for input
                  backdropFilter: "blur(5px)",
                  height: "50px", // Match button height for alignment
                  borderRadius: 1, // Slightly rounded corners
                },
                // Colors for the label and input text
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)", // Dark grey for label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black", // Darker label when focused
                },
                "& .MuiOutlinedInput-input": {
                  color: "black", // Dark text inside input
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.2)", // Light border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.4)", // Darker border on hover
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "black", // Black border when focused
                  },
                // Adjust TextField width on small screens so button can fit
                minWidth: { xs: "calc(100% - 80px)", sm: "auto" }, // Example: make TextField smaller if needed
              }}
            />
            <Button
              onClick={() => {}} // Your search handler here
              variant="contained"
              sx={{
                height: "50px", // Match TextField height
                backgroundColor: "rgba(186, 147, 223, 0.8)", // Black as per image
                color: "white",
                borderRadius: 1, // Slightly rounded corners
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker black on hover
                },
                flexShrink: 0, // Prevent button from shrinking
              }}
            >
              <Search sx={{ marginRight: 0.5 }} />
              Search
            </Button>
          </Box>

          {/* "Try these popular users" section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrendingUp sx={{ marginRight: 0.5, color: "white" }} />{" "}
            {/* Trending icon */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Try these popular users:
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 5 }}
          >
            {["octocat", "torvalds", "facebook"].map((user) => (
              <Button
                key={user}
                onClick={() => {
                  /* Handle clicking popular user, e.g., set search input value */
                }}
                variant="text" // Use text variant with custom background to look like the image
                size="small"
                sx={{
                  borderRadius: "20px", // Pill shape
                  // Match existing button's color scheme, but slightly lighter for the "tags"
                  backgroundColor: "rgba(173, 166, 247, 0.5)", // Lighter purple fill
                  color: "white",
                  textTransform: "none", // Prevent uppercase
                  "&:hover": {
                    backgroundColor: "rgba(173, 166, 247, 0.7)", // Slightly darker purple on hover
                  },
                  border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
                }}
              >
                {user}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchPage;
