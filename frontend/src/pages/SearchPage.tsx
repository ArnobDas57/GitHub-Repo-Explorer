import { useEffect, useState, useContext, Suspense } from "react";
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
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

function MeshyModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1} />;
}

function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "300px",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "rgba(185, 29, 29, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
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
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

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
    <Paper sx={{ backgroundColor: "rgb(200, 203, 249)" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="rgb(19, 50, 61)"
        sx={{ padding: 2 }}
      >
        Discover GitHub Repositories
      </Typography>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search Repositories"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, padding: 1 }}
        >
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

        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                }}
              >
                <CircularProgress />
                <Typography sx={{ marginLeft: 2 }}>
                  Loading 3D model...
                </Typography>
              </Box>
            }
          >
            <ModelViewer modelPath="/models/purple_Github_logo_wi_0630153742_texture.glb" />
          </Suspense>
        </Box>

        {/* Placeholder for popular repositories */}
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="info">No popular repositories available.</Alert>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchPage;
