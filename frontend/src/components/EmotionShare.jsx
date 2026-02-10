// src/components/EmotionShare.jsx - Fully Responsive
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Slider,
  Avatar,
  Container,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Heart, SmilePlus, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmotions, createEmotionPost } from "../services/api";
import { getOrCreateUserId } from "../utils/userId";

const emotions = {
  1: "😢 Много тъжен",
  2: "😕 Тъжен",
  3: "😐 Неутрален",
  4: "🙂 Добре",
  5: "😊 Много добре",
};

const energyLevels = {
  1: "🔋 Много ниска енергия",
  2: "😴 Уморен",
  3: "🙂 Нормална",
  4: "⚡ Енергичен",
  5: "🔥 Много енергичен",
};

export default function EmotionShare() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [userId] = useState(() => getOrCreateUserId());
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [emotionLevel, setEmotionLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await getEmotions(userId);
        setPosts(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("❌ Error loading posts:", err);
        setError("Грешка при зареждане на постовете.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId]);

  const handlePost = async () => {
    if (!newPost.trim()) {
      setError("Моля, напишете нещо.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const post = {
        mood: emotionLevel,
        energy: energyLevel,
        note: newPost,
      };

      const res = await createEmotionPost(post);
      const newEmotion = res.data || res;
      setPosts((prev) => [newEmotion, ...prev]);

      setNewPost("");
      setEmotionLevel(3);
      setEnergyLevel(3);
    } catch (err) {
      console.error("❌ Error posting:", err);
      const errorMsg = err.response?.data?.error || err.userMessage || "Грешка при публикуване.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (post) => {
    const dateValue = post.timestamp || post.date || post.createdAt;
    if (!dateValue) return "Няма дата";

    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "Невалидна дата" : date.toLocaleString("bg-BG");
  };

  if (!userId) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">
            Грешка при зареждане на профила. Моля, опреснете страницата.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 0 } }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight="600"
          sx={{
            mb: { xs: 3, md: 4 },
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
          }}
        >
          Как се чувстваш днес?
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 4, md: 6 },
              borderRadius: { xs: 3, md: 4 },
              background: "linear-gradient(135deg, #fff 0%, #f0f7ff 100%)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            {/* EMOTION SLIDER */}
            <Typography
              variant="h5"
              fontWeight="500"
              sx={{
                mb: 2,
                fontSize: { xs: "1.15rem", sm: "1.35rem", md: "1.5rem" },
              }}
            >
              {emotions[emotionLevel]}
            </Typography>
            <Slider
              value={emotionLevel}
              min={1}
              max={5}
              marks
              step={1}
              onChange={(_, val) => setEmotionLevel(val)}
              sx={{
                mb: 4,
                "& .MuiSlider-track": {
                  background: "linear-gradient(to right, #6366f1, #ec4899)",
                },
                "& .MuiSlider-thumb": {
                  width: { xs: 20, md: 24 },
                  height: { xs: 20, md: 24 },
                },
              }}
            />

            {/* ENERGY SLIDER */}
            <Typography
              variant="h6"
              fontWeight="500"
              sx={{
                mb: 2,
                fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
              }}
            >
              {energyLevels[energyLevel]}
            </Typography>
            <Slider
              value={energyLevel}
              min={1}
              max={5}
              marks
              step={1}
              onChange={(_, val) => setEnergyLevel(val)}
              sx={{
                mb: 4,
                "& .MuiSlider-track": {
                  background: "linear-gradient(to right, #10b981, #6366f1)",
                },
                "& .MuiSlider-thumb": {
                  width: { xs: 20, md: 24 },
                  height: { xs: 20, md: 24 },
                },
              }}
            />

            {/* TEXT AREA */}
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              placeholder="Сподели своите мисли..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* SUBMIT BUTTON */}
            <motion.div whileHover={{ scale: isMobile ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                fullWidth
                size={isMobile ? "medium" : "large"}
                startIcon={<Heart />}
                onClick={handlePost}
                disabled={isLoading}
                sx={{
                  py: { xs: 1.25, md: 1.5 },
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  background: "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)",
                }}
              >
                {isLoading ? "Публикуване..." : "Сподели"}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>

        {/* POSTS */}
        {isLoading && posts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography>Зареждане...</Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div
                key={post._id || i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: i * 0.1 }}
              >
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    mb: 3,
                    borderRadius: { xs: 2, md: 3 },
                  }}
                >
                  <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
                    <Grid item>
                      <Avatar
                        sx={{
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          bgcolor: "primary.light",
                        }}
                      >
                        <SmilePlus size={isMobile ? 24 : 28} />
                      </Avatar>
                    </Grid>

                    <Grid item xs>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          fontSize: { xs: "0.95rem", md: "1rem" },
                        }}
                      >
                        {post.note}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                      >
                        <Calendar size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                        {formatDate(post)}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                        }}
                      >
                        😊 Настроение: <strong>{emotions[post.mood]}</strong>
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                        }}
                      >
                        ⚡ Енергия: <strong>{energyLevels[post.energy]}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && posts.length === 0 && (
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              Все още нямаш записани емоции.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
              }}
            >
              Започни като споделиш как се чувстваш днес! 💙
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
