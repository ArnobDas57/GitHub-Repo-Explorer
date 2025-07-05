import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Fade,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import {
  Search,
  Star,
  Code,
  DeleteForever,
  OpenInNew,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

interface FavoriteRepo {
  repo_id: string;
  name: string;
  description: string | null;
  starCount: number;
  link: string;
  language: string | null;
  user_id: string;
  created_at: string;
  owner_login: string;
  owner_avatar_url: string;
}

const FavoritesPage = () => {
  const [favoriteRepos, setFavoriteRepos] = useState<Array<FavoriteRepo>>([]);
  const [fetchingFavoriteRepos, setFetchingFavorites] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<FavoriteRepo | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
  
        return () => {
          clearTimeout(timer);
        };
      }
    }, [successMessage]);

  useEffect(() => {
    const fetchFavoriteRepos = async (): Promise<void> => {
      setFetchingFavorites(true);
      setErrorMessage("");
      try {
        const response = await axiosInstance.get("/user/favorites");
        setFavoriteRepos(response.data);
      } catch (error) {
        console.error("Failed to fetch favorite repositories:", error);
        setErrorMessage(
          "Failed to load your favorite repositories. Please try again later."
        );
      } finally {
        setFetchingFavorites(false);
      }
    };

    fetchFavoriteRepos();
  }, []);

  const handleClickOpenConfirm = (repo: FavoriteRepo) => {
    setRepoToDelete(repo);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setRepoToDelete(null);
  };

  const handleRemoveFavorite = async (): Promise<void> => {
    if (!repoToDelete) return;

    setOpenConfirm(false);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axiosInstance.delete(`/user/favorites/${repoToDelete.repo_id}`);
      setFavoriteRepos((prevRepos) =>
        prevRepos.filter((repo) => repo.repo_id !== repoToDelete.repo_id)
      );
      setSuccessMessage("Repository successfully removed from favorites!");
    } catch (error) {
      console.error("Failed to remove favorite repository:", error);
      setErrorMessage(
        `Error removing repository: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    } finally {
      setRepoToDelete(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Box>
        <Typography
          color="white"
          variant="h3"
          fontWeight="bold"
          sx={{
            textAlign: "center",
            background:
              "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: `${gradientAnimation} 3s linear infinite`,
          }}
        >
          Your Favorite Repositories
        </Typography>
      </Box>

      {successMessage && (
        <Fade in={true} timeout={1000}>
          <Alert
            severity="success"
            variant="filled"
            sx={{
              width: "fit-content",
              backgroundColor: "rgba(76, 175, 80, 0.8)",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </Alert>
        </Fade>
      )}
      {errorMessage && (
        <Fade in={true} timeout={1000}>
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              padding: 2,
              backgroundColor: "rgba(188, 18, 18, 0.61)",
            }}
          >
            <Typography color="white">{errorMessage}</Typography>
          </Alert>
        </Fade>
      )}

      {fetchingFavoriteRepos ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box sx={{ marginTop: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              sx={{
                background:
                  "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                animation: `${gradientAnimation} 3s linear infinite`,
              }}
            >
              {favoriteRepos.length} saved repositories
            </Typography>
          </Box>
          <Divider
            sx={{
              width: "80%",
              maxWidth: 600,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              mb: 4,
            }}
          />

          {favoriteRepos.length === 0 ? (
            <Fade in={true} timeout={1500}>
              <Paper
                sx={{
                  backgroundColor: "rgba(156, 116, 215, 0.28)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  padding: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: 600,
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <Typography variant="h6" textAlign="center">
                  You haven't saved any repositories yet!
                </Typography>
                <Typography variant="body1" textAlign="center">
                  Go to the search page to start building your collection.
                </Typography>
              </Paper>
            </Fade>
          ) : (
            <Fade in={true} timeout={1000}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(auto-fill, minmax(300px, 1fr))",
                  },
                  gap: { xs: 3, md: 4 },
                  justifyContent: "center",
                  maxWidth: 1200,
                  width: "100%",
                  margin: "0 auto",
                  paddingX: { xs: 1, sm: 2 },
                  mb: 5,
                }}
              >
                {favoriteRepos.map((repo: FavoriteRepo) => (
                  <Card
                    key={repo.repo_id}
                    sx={{
                      p: 2,
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                      backgroundColor: "rgba(136, 96, 230, 0.74)",
                      color: "white",
                      borderRadius: 2,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.4)",
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          gap: 1,
                        }}
                      >
                        <Avatar
                          alt={repo.owner_login}
                          src={repo.owner_avatar_url}
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2px solid rgba(255,255,255,0.7)",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            background:
                              "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundSize: "200% auto",
                            animation: `${gradientAnimation} 5s linear infinite`,
                            lineHeight: 1.2,
                          }}
                        >
                          {repo.name}
                        </Typography>
                      </Box>
                      {repo.description && (
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, opacity: 0.9 }}
                        >
                          {repo.description}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Star sx={{ fontSize: 16, mr: 0.5, color: "gold" }} />{" "}
                        {repo.starCount} stars
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Code sx={{ fontSize: 16, mr: 0.5 }} /> Language:{" "}
                        {repo.language || "N/A"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ mb: 1, display: "block", opacity: 0.8 }}
                      >
                        Saved: {new Date(repo.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        href={repo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "white",
                          borderColor: "black",
                          background:
                            "linear-gradient(-45deg, #FE6B8B, #FF8E53, #FE6B8B, #FF8E53)",
                          backgroundSize: "400% 400%",
                          ":hover": {
                            backgroundPosition: "100% 50%",
                            boxShadow: "0 4px 20px rgba(255, 105, 135, 0.5)",
                            transform: "scale(1.05)",
                          },
                          animation: "gradientShift 5s ease infinite",
                          "@keyframes gradientShift": {
                            "0%": {
                              backgroundPosition: "0% 50%",
                            },
                            "50%": {
                              backgroundPosition: "100% 50%",
                            },
                            "100%": {
                              backgroundPosition: "0% 50%",
                            },
                          },
                        }}
                      >
                        View on GitHub
                        <OpenInNew sx={{ marginLeft: 0.4 }} />
                      </Button>
                      <Button
                        onClick={() => handleClickOpenConfirm(repo)}
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteForever />}
                        sx={{
                          flexGrow: 1,
                          minWidth: "120px",
                          color: "white",
                          borderColor: "black",
                          background:
                            "linear-gradient(-45deg, #f00a48, #dc6ee5, #f00a48, #dc6ee5)",
                          backgroundSize: "400% 400%",
                          ":hover": {
                            backgroundPosition: "100% 50%",
                            boxShadow: "0 4px 20px rgba(255, 105, 135, 0.5)",
                            transform: "scale(1.05)",
                          },
                          animation: "gradientShift 5s ease infinite",
                          "@keyframes gradientShift": {
                            "0%": {
                              backgroundPosition: "0% 50%",
                            },
                            "50%": {
                              backgroundPosition: "100% 50%",
                            },
                            "100%": {
                              backgroundPosition: "0% 50%",
                            },
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Fade>
          )}
        </>
      )}

      <Fade in={true} timeout={1000}>
        <Paper
          sx={{
            backgroundColor: "rgba(156, 116, 215, 0.28)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            padding: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 600,
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background:
                "linear-gradient(90deg,rgb(48, 247, 204),rgb(246, 206, 255), rgb(48, 247, 204))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
              animation: `${gradientAnimation} 3s linear infinite`,
              textAlign: "center",
            }}
          >
            Discover More Repositories
          </Typography>
          <Button
            onClick={() => {
              navigate("/search");
            }}
            fullWidth
            variant="contained"
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
        </Paper>
      </Fade>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: "#3CCBFB73",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{
            color: "white",
            fontWeight: "bold",
            wordSpacing: 2,
            letterSpacing: 1,
          }}
        >
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            sx={{ color: "white" }}
          >
            Are you sure you want to remove "
            <span style={{ fontWeight: "bold" }}>{repoToDelete?.name}</span>"
            from your favorites? This action cannot be undone.
            {errorMessage && (
              <Fade in={true} timeout={2000}>
                <Typography sx={{ marginTop: 2 }} color="#E6A519">
                  Failed to remove repository
                </Typography>
              </Fade>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirm}
            sx={{
              color: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveFavorite}
            autoFocus
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 0, 0, 0.6)",
              "&:hover": { backgroundColor: "rgba(255, 0, 0, 1)" },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FavoritesPage;
