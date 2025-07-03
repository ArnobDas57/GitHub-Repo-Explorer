import { Suspense, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { Search, TrendingUp } from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { keyframes } from "@emotion/react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

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
        <ambientLight intensity={2} />

        <Suspense fallback={null}>
          <MeshyModel modelPath={modelPath} />
        </Suspense>

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

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

const SearchPage = () => {
  const [user, setUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");
  const [repos, setRepos] = useState<Array<GitHubRepo>>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (userToSearch: string): Promise<void> => {
    const GITHUB_REPOS_LINK: string = `https://api.github.com/users/${userToSearch}/repos`;

    setLoading(true);
    setErrMessage("");
    setRepos([]);

    try {
      const res = await axios.get(GITHUB_REPOS_LINK);
      setRepos(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrMessage(
          `GitHub user "${user}" not found or has no public repositories.`
        );
      } else {
        setErrMessage(
          `Error retrieving repositories: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`
        );
        console.error("Failed to retrieve repositories", error);
      }
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          backgroundColor: "rgba(156, 116, 215, 0.28)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          padding: 2,
          borderRadius: 2,
          width: "100%",
          maxWidth: 1000,
          margin: "auto",
          overflow: "auto",
        }}
      >
        {/* Header section with Typography and 3D Model side by side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: 2,
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

        {/* Description Section */}
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

        {/* Search GitHub User Section */}
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
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="GitHub Username"
              placeholder="Enter GitHub username (e.g., google)"
              variant="outlined"
              margin="none"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
              sx={{
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(5px)",
                  height: "50px",
                  borderRadius: 1,
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black",
                },
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.4)",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "black",
                  },
                minWidth: { xs: "calc(100% - 80px)", sm: "auto" },
              }}
            />
            <Button
              onClick={() => handleSearch(user)}
              sx={{
                height: "50px",
                backgroundColor: "rgba(186, 147, 223, 0.8)",
                color: "white",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
                flexShrink: 0,
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
            {["google", "amzn", "facebook"].map((popularUser) => (
              <Button
                key={popularUser}
                onClick={() => {
                  setUser(popularUser);
                  handleSearch(popularUser);
                }}
                variant="text"
                size="small"
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "rgba(173, 166, 247, 0.5)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(173, 166, 247, 0.7)",
                  },
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {popularUser}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Conditional Rendering for Search Results / Status */}
      {loading ? (
        <LoadingSpinner />
      ) : errMessage ? (
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              padding: 2,
              width: 300,
              backgroundColor: "rgba(188, 18, 18, 0.61)",
            }}
          >
            <Typography color="white">{errMessage}</Typography>
          </Alert>
        </Box>
      ) : hasSearched && repos.length > 0 ? (
        <Box>
          <Fade in={true} timeout={2000}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 5,
                marginTop: 3,
                marginBottom: 10,
              }}
            >
              <Box sx={{ mx: "auto" }}>
                <Typography
                  color="white"
                  variant="h4"
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
                  Repositories by {user}
                </Typography>
              </Box>
              <Box sx={{ mx: "auto" }}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgb(74, 25, 97)",
                    borderRadius: "6px",
                    padding: "1",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                    border: "none",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: 2 }}>
                    <Typography
                      variant="h4"
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
                      {repos.length} Repositories
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Fade>

          <Box
            sx={{
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {repos.map((repo: GitHubRepo) => (
              <Box key={repo.id} sx={{ m: 1 }}>
                {" "}
                {/* Added key and margin */}
                <Card
                  sx={{
                    p: 2,
                    minWidth: 280,
                    maxWidth: 350,
                    boxShadow: "3px 3px 5px rgba(0,0,0,0.2)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {repo.name}
                  </Typography>
                  {repo.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {repo.description}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    ⭐ {repo.stargazers_count}
                  </Typography>
                  <Typography variant="body2">
                    Language: {repo.language || "N/A"}
                  </Typography>
                  <Button
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      color: "white",
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    View on GitHub
                  </Button>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      ) : hasSearched && repos.length === 0 && !errMessage ? (
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              padding: 2,
              width: 300,
              backgroundColor: "rgba(100, 100, 200, 0.61)",
            }}
          >
            <Typography color="white">
              No public repositories found for "{user}".
            </Typography>
          </Alert>
        </Box>
      ) : null}
    </Box>
  );
};

export default SearchPage;
