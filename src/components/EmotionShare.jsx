import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Slider, Avatar, Container, Alert } from '@mui/material';
import { Heart, SmilePlus, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmotions, createEmotionPost } from '../api';

const emotions = {
  1: '😢 Много тъжен',
  2: '😕 Тъжен',
  3: '😐 Неутрален',
  4: '🙂 Добре',
  5: '😊 Много добре'
};

export default function EmotionShare() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [emotionLevel, setEmotionLevel] = useState(3);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getEmotions();
        setPosts(response.data);
      } catch (err) {
        setError('Грешка при зареждане на постовете. Моля, опитайте отново.');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      
      const post = {
        userId: 'temp-user-id', // Replace with actual user ID after adding auth
        text: newPost,
        emotion: emotionLevel
      };

      const response = await createEmotionPost(post);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setNewPost('');
      setEmotionLevel(3);
    } catch (err) {
      setError('Грешка при публикуване. Моля, опитайте отново.');
      console.error('Error creating post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center" fontWeight="600" sx={{ mb: 4 }}>
          Как се чувстваш днес?
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mt: 2, 
              mb: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
            <Typography variant="h5" gutterBottom fontWeight="500" sx={{ mb: 3 }}>
              {emotions[emotionLevel]}
            </Typography>
            <Slider
              value={emotionLevel}
              min={1}
              max={5}
              step={1}
              marks
              onChange={(_, value) => setEmotionLevel(value instanceof Array ? value[0] : value)}
              sx={{ 
                mb: 4,
                '& .MuiSlider-mark': {
                  backgroundColor: '#6366f1',
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(to right, #6366f1, #ec4899)'
                }
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Сподели своите мисли и чувства тук..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '&:hover': {
                    '& > fieldset': { borderColor: 'primary.main' }
                  }
                }
              }}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="contained" 
                startIcon={<Heart />}
                fullWidth
                size="large"
                onClick={handlePost}
                disabled={isLoading}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                  boxShadow: '0 3px 12px rgba(99, 102, 241, 0.2)'
                }}
              >
                Сподели
              </Button>
            </motion.div>
          </Paper>
        </motion.div>

        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={`${post.id}-${index}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 3,
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                <Grid container spacing={3} alignItems="flex-start">
                  <Grid item>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: 'primary.light',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                      }}>
                      <SmilePlus size={28} />
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.6 }}>
                      {post.text}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Calendar size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.timestamp).toLocaleString('bg-BG')} • {emotions[post.emotion]}
                      </Typography>
                    </Box>
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