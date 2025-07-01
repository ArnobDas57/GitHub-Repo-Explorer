import { Suspense } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

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
    <Paper
      sx={{
        backgroundColor: "rgba(113, 54, 202, 0.28)", // Made semi-transparent
        backdropFilter: "blur(10px)", // Added blur effect
        border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Soft shadow
        padding: 2,
        borderRadius: 2,
      }}
    >
      {/* Header section with Typography and 3D Model side by side */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          color="rgb(255, 255, 255)"
          sx={{
            flex: 1,
          }}
        >
          Discover GitHub Repositories
        </Typography>

        <Box sx={{ flexShrink: 0 }}>
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

      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search Repositories"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(5px)",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1,
            backgroundColor: "rgba(30, 72, 144, 0.9)",
            backdropFilter: "blur(5px)",
            "&:hover": {
              backgroundColor: "rgba(30, 72, 144, 1)",
            },
          }}
        >
          Search
        </Button>
      </Box>
      <Divider
        sx={{ margin: 2, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="white">
          Search Results
        </Typography>
        {/* Placeholder for search results */}
        <Box sx={{ marginTop: 2 }}>
          <Alert
            severity="info"
            sx={{
              backgroundColor: "rgba(2, 136, 209, 0.1)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(2, 136, 209, 0.3)",
            }}
          >
            No results found. Try a different search.
          </Alert>
        </Box>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="white">
          Popular Repositories
        </Typography>

        {/* Placeholder for popular repositories */}
        <Box sx={{ marginTop: 2 }}>
          <Alert
            severity="info"
            sx={{
              backgroundColor: "rgba(2, 136, 209, 0.1)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(2, 136, 209, 0.3)",
            }}
          >
            No popular repositories available.
          </Alert>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchPage;
