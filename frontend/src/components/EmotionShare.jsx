// src/components/EmotionShare.jsx - ПОПРАВЕНА ВЕРСИЯ

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, 
  Grid, Slider, Avatar, Container, Alert 
} from '@mui/material';
import { Heart, SmilePlus, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmotions, createEmotionPost } from '../services/api';
import { useAnonymous } from "../context/AnonymousContext";

// Текстове за настроение
const emotions = {
  1: '😢 Много тъжен',
  2: '😕 Тъжен',
  3: '😐 Неутрален',
  4: '🙂 Добре',
  5: '😊 Много добре'
};

// Текстове за енергия
const energyLevels = {
  1: "🔋 Много ниска енергия",
  2: "😴 Уморен",
  3: "🙂 Нормална",
  4: "⚡ Енергичен",
  5: "🔥 Много енергичен"
};

export default function EmotionShare() {
  const { userId } = useAnonymous();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const [emotionLevel, setEmotionLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load all posts за текущия потребител
  useEffect(() => {
    if (!userId) return;  
    
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await getEmotions(userId); // ✅ Подаваме userId
        console.log("📥 Loaded posts:", res.data);
        setPosts(res.data);
      } catch (err) {
        console.error("❌ Error loading posts:", err);
        setError("Грешка при зареждане на постовете.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId]);

  // Submit a new post
  const handlePost = async () => {
    if (!newPost.trim()) {
      setError("Моля, напишете нещо.");
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // ✅ Изпращаме точно това, което очаква бекенда
      const post = {
        mood: emotionLevel,
        energy: energyLevel,
        note: newPost
      };

      console.log("📤 Sending post:", post);

      const res = await createEmotionPost(post);
      
      console.log("✅ Post saved:", res.data);

      // ✅ Добавяме новия пост в списъка
      setPosts(prev => [res.data, ...prev]);

      // ✅ Изчистваме формата
      setNewPost('');
      setEmotionLevel(3);
      setEnergyLevel(3);

    } catch (err) {
      console.error("❌ Error posting:", err);
      setError("Грешка при публикуване.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">
            Моля, влезте, за да споделяте емоции.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        
        <Typography 
          variant="h3" 
          align="center" 
          fontWeight="600" 
          sx={{ mb: 4 }}
        >
          Как се чувстваш днес?
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* --- Form --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 4,
              background: "linear-gradient(135deg, #fff 0%, #f0f7ff 100%)",
              border: "1px solid rgba(99,102,241,0.15)"
            }}
          >
            {/* EMOTION SLIDER */}
            <Typography variant="h5" fontWeight="500" sx={{ mb: 2 }}>
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
                  background: "linear-gradient(to right, #6366f1, #ec4899)"
                }
              }}
            />

            {/* ENERGY SLIDER */}
            <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
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
                  background: "linear-gradient(to right, #10b981, #6366f1)"
                }
              }}
            />

            {/* TEXT AREA */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Сподели своите мисли..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* SUBMIT BUTTON */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Heart />}
                onClick={handlePost}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  background: "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)"
                }}
              >
                {isLoading ? "Публикуване..." : "Сподели"}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>

        {/* --- POSTS --- */}
        <AnimatePresence>
          {posts.map((post, i) => (
            <motion.div 
              key={post._id || i}
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }}
            >
              <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="flex-start">
                  <Grid item>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.light" }}>
                      <SmilePlus size={28} />
                    </Avatar>
                  </Grid>

                  <Grid item xs>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.note}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Calendar size={16} style={{ marginRight: 6 }} />
                      {new Date(post.timestamp).toLocaleString("bg-BG")}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      😊 Настроение: <strong>{emotions[post.mood]}</strong>
                    </Typography>

                    <Typography>
                      ⚡ Енергия: <strong>{energyLevels[post.energy]}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>

      </Box>
    </Container>
  );
}