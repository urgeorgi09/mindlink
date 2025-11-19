import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Typography, Container, 
  Grid, Card, CardContent, Button, CircularProgress,
  ThemeProvider, CssBaseline
} from '@mui/material';
import { Heart, MessageCircle, TrendingUp, Phone, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import theme from './theme/theme';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const EmotionShare = lazy(() => import('./components/EmotionShare'));
const AiChat = lazy(() => import('./components/AiChat'));
const MoodTracker = lazy(() => import('./components/MoodTracker'));
const TherapistDirectory = lazy(() => import('./components/TherapistDirectory'));

// Loading component
const PageLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh' 
  }}>
    <CircularProgress size={60} thickness={4} />
  </Box>
);

// Navigation Bar
function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1, px: 0 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box 
              component={Link} 
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                textDecoration: 'none'
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Heart size={22} color="white" fill="white" />
              </Box>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                MindLink+
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          {!isHome && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/"
                startIcon={<Home size={18} />}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderWidth: 2,
                  fontWeight: 600,
                  px: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { 
                    borderWidth: 2,
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                  },
                }}
              >
                Начало
              </Button>
            </motion.div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Home Page
function HomePage() {
  const cards = [
    {
      icon: Heart,
      title: 'Как се чувствам',
      description: 'Сподели настроението и енергията си',
      path: '/emotion',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.2) 100%)',
      glowColor: 'rgba(236, 72, 153, 0.3)',
      iconColor: '#ec4899',
    },
    {
      icon: MessageCircle,
      title: 'AI помощник',
      description: 'Поговори с AI терапевт',
      path: '/chat',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(129, 140, 248, 0.2) 100%)',
      glowColor: 'rgba(99, 102, 241, 0.3)',
      iconColor: '#6366f1',
    },
    {
      icon: TrendingUp,
      title: 'Моята статистика',
      description: 'Проследи напредъка си',
      path: '/mood',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 6, md: 10 },
                p: { xs: 4, md: 6 },
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={56} style={{ marginBottom: 16 }} />
              </motion.div>

              <Typography 
                variant="h2" 
                fontWeight="800" 
                gutterBottom
                sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
              >
                Здравей! 👋
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2, 
                  opacity: 0.95,
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                Как се чувстваш днес?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.9, 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Тук си на сигурно място да споделиш своите емоции
              </Typography>
            </Box>
          </motion.div>

          {/* Glassy Cards */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: { xs: 6, md: 10 }
          }}>
            <Grid 
              container 
              spacing={{ xs: 3, md: 4 }} 
              sx={{ 
                maxWidth: '1000px',
                justifyContent: 'center'
              }}
            >
              {cards.map((card, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    style={{ width: '100%', maxWidth: '320px' }}
                  >
                    <Card
                      component={Link}
                      to={card.path}
                      sx={{
                        height: '100%',
                        minHeight: '280px',
                        textDecoration: 'none',
                        borderRadius: 5,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(30px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: card.gradient,
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                        },
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          border: `2px solid ${card.iconColor}`,
                          boxShadow: `0 20px 60px ${card.glowColor}, 0 0 40px ${card.glowColor}`,
                          '&::before': {
                            opacity: 1,
                          },
                          '& .card-icon-wrapper': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: `0 8px 30px ${card.glowColor}`,
                          },
                        },
                      }}
                    >
                      <CardContent 
                        sx={{ 
                          p: 4, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <Box
                          className="card-icon-wrapper"
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          <card.icon size={40} color="white" strokeWidth={2.5} />
                        </Box>

                        <Typography 
                          variant="h5" 
                          fontWeight="700" 
                          gutterBottom
                          sx={{ 
                            color: 'white',
                            mb: 1.5,
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.6,
                            textShadow: '0 1px 5px rgba(0, 0, 0, 0.15)'
                          }}
                        >
                          {card.description}
                        </Typography>
                      </CardContent>

                      {/* Shine effect */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                          transform: 'rotate(45deg)',
                          animation: 'shine 3s ease-in-out infinite',
                          '@keyframes shine': {
                            '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
                            '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
                          },
                        }}
                      />
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 5,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                maxWidth: '900px',
                mx: 'auto',
              }}
            >
              <Grid 
                container 
                alignItems="center" 
                spacing={{ xs: 3, md: 4 }}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Phone size={36} color="white" strokeWidth={2.5} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography 
                    variant="h5" 
                    fontWeight="700" 
                    gutterBottom
                    sx={{ 
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                      fontSize: { xs: '1.5rem', md: '1.75rem' }
                    }}
                  >
                    Нуждаеш се от професионална помощ?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 5px rgba(0, 0, 0, 0.15)',
                      fontSize: { xs: '1rem', md: '1.1rem' }
                    }}
                  >
                    Открий психолози и терапевти в твоя град
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/therapists"
                      variant="contained"
                      size="large"
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.35)',
                          boxShadow: '0 6px 30px rgba(255, 255, 255, 0.3)',
                        },
                      }}
                    >
                      Намери специалист
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Box sx={{ minHeight: '100vh' }}>
            <Navigation />
            
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/emotion" element={<EmotionShare />} />
                <Route path="/chat" element={<AiChat />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/therapists" element={<TherapistDirectory />} />
              </Routes>
            </Suspense>
          </Box>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}