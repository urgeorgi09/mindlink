// src/pages/Home.jsx - Fully Responsive
import React from "react";
import { Container, Box, Typography, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 5 },
        background: 'linear-gradient(135deg, #a78bfa, #6366f1, #3b82f6)',
        animation: 'gradientShift 15s ease infinite',
        backgroundSize: '300% 300%',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: { xs: 3, sm: 4, md: 5 },
              p: { xs: 3, sm: 4, md: 6 },
              backdropFilter: 'blur(15px)',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              color: 'white'
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' }
              }}
            >
              MindLink+
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                lineHeight: { xs: 1.5, md: 1.6 },
                mb: { xs: 3, sm: 4, md: 5 },
                opacity: 0.9,
                px: { xs: 0, sm: 2, md: 4 }
              }}
            >
              Подобри твоето емоционално състояние със AI-навигирани инструменти,
              всекидневен дневник, следене на емоциите и успокояващи упражнения.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                sx={{
                  background: '#ffffff',
                  color: '#4f46e5',
                  fontWeight: 700,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 1.75 },
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  borderRadius: 3,
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: '#f3f4f6',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
                  }
                }}
              >
                🌟 Отиди при твоята дъска
              </Button>

              <Button
                component={Link}
                to="/journal"
                variant="outlined"
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 700,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 1.75 },
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                📘 Отвори Дневника
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}