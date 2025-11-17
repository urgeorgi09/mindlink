import React from 'react';
import { Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log errorInfo here
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          <strong>Грешка:</strong> {this.state.error?.message || 'Неизвестна грешка.'}
          <br />
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em', marginTop: 8 }}>
            {this.state.error?.stack}
          </pre>
        </Alert>
      );
    }
    return this.props.children;
  }
}

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, ThemeProvider, CssBaseline } from '@mui/material';
import { Heart, MessageCircle, TrendingUp, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import EmotionShare from './components/EmotionShare';
import AiChat from './components/AiChat';
import MoodTracker from './components/MoodTracker';
import TherapistDirectory from './components/TherapistDirectory';

import theme from './theme';

function Home() {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <Sparkles /> Здравей! 👋
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Как се чувстваш днес? Тук си на сигурно място да споделиш.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              component={Link} 
              to="/emotion" 
              sx={{ 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <CardContent sx={{ flex: 1, p: 4 }}>
                <Box sx={{ color: 'primary.main', mb: 3 }}>
                  <Heart size={32} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="600">Как се чувствам</Typography>
                <Typography color="text.secondary" variant="body1">
                  Сподели настроението си в безопасна среда
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              component={Link} 
              to="/chat" 
              sx={{ 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #fff 0%, #fdf2f8 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <CardContent sx={{ flex: 1, p: 4 }}>
                <Box sx={{ color: 'secondary.main', mb: 3 }}>
                  <MessageCircle size={32} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="600">AI помощник</Typography>
                <Typography color="text.secondary" variant="body1">
                  Поговори с мен за каквото те вълнува
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              component={Link} 
              to="/mood" 
              sx={{ 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <CardContent sx={{ flex: 1, p: 4 }}>
                <Box sx={{ color: 'success.main', mb: 3 }}>
                  <TrendingUp size={32} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="600">Моята статистика</Typography>
                <Typography color="text.secondary" variant="body1">
                  Проследи напредъка си във времето
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Box 
        sx={{ 
          mt: 8,
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)'
        }}>
        <Grid container alignItems="center" spacing={4}>
          <Grid item>
            <Box sx={{ 
              bgcolor: 'primary.light',
              p: 2,
              borderRadius: 2,
              color: 'white'
            }}>
              <Phone size={32} />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Нуждаеш се от професионална помощ?
            </Typography>
            <Typography color="text.secondary" variant="h6">
              Открий психолози и терапевти в твоя град
            </Typography>
          </Grid>
          <Grid item>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                component={Link} 
                to="/therapists" 
                variant="contained" 
                size="large"
                sx={{ 
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                Намери специалист
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
              <Toolbar>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={24} style={{ marginRight: '12px', color: theme.palette.primary.main }} />
                </motion.div>
                <Typography 
                  variant="h6" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    flexGrow: 1, 
                    textDecoration: 'none', 
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}>
                  MindLink+
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ py: 3 }}>
              <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/emotion" element={<EmotionShare />} />
                <Route path="/chat" element={<AiChat />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/therapists" element={<TherapistDirectory />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
