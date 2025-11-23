// src/components/BreathingExercise.jsx - Fully Responsive
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Square, Heart } from "lucide-react";

const BreathingExercise = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isActive, setIsActive] = useState(false);
  const [technique, setTechnique] = useState("478");
  const [count, setCount] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const techniques = {
    "478": {
      name: "4-7-8 Дишане",
      icon: Wind,
      phases: [
        { name: "inhale", text: "ВДИШАЙ", duration: 4, color: "#3B82F6" },
        { name: "hold", text: "ЗАДРЪЖ", duration: 7, color: "#8B5CF6" },
        { name: "exhale", text: "ИЗДИШАЙ", duration: 8, color: "#EC4899" },
      ],
    },
    box: {
      name: "Box Дишане",
      icon: Square,
      phases: [
        { name: "inhale", text: "ВДИШАЙ", duration: 4, color: "#3B82F6" },
        { name: "hold", text: "ЗАДРЪЖ", duration: 4, color: "#8B5CF6" },
        { name: "exhale", text: "ИЗДИШАЙ", duration: 4, color: "#EC4899" },
        { name: "hold", text: "ЗАДРЪЖ", duration: 4, color: "#F59E0B" },
      ],
    },
    calm: {
      name: "5-5 Спокойствие",
      icon: Heart,
      phases: [
        { name: "inhale", text: "ВДИШАЙ", duration: 5, color: "#3B82F6" },
        { name: "exhale", text: "ИЗДИШАЙ", duration: 5, color: "#EC4899" },
      ],
    },
  };

  const currentTechnique = techniques[technique];
  const currentPhase = currentTechnique.phases[currentPhaseIndex];

  useEffect(() => {
    if (!isActive) return;

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }

    const nextIndex = (currentPhaseIndex + 1) % currentTechnique.phases.length;

    if (nextIndex === 0) setCompletedCycles((prev) => prev + 1);

    setCurrentPhaseIndex(nextIndex);
    setCount(currentTechnique.phases[nextIndex].duration);
  }, [isActive, count, currentPhaseIndex, currentTechnique]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setCount(currentTechnique.phases[0].duration);
    setCompletedCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setCount(0);
  };

  const circleSize = isMobile ? 180 : isTablet ? 200 : 220;

  return (
    <Container 
      maxWidth="md" 
      sx={{ py: { xs: 3, sm: 4, md: 5 } }}
    >
      <Paper
        elevation={4}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 4, 
          background: "#fafafa" 
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 3, md: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
          >
            Дихателни Упражнения
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Намали стреса и тревожността с контролирано дишане
          </Typography>
        </Box>

        {/* Technique Selection */}
        {!isActive && (
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            mb={{ xs: 3, md: 4 }}
            sx={{ px: { xs: 1, sm: 0 } }}
          >
            {Object.entries(techniques).map(([key, tech]) => {
              const Icon = tech.icon;
              return (
                <Chip
                  key={key}
                  label={tech.name}
                  icon={<Icon size={18} />}
                  onClick={() => setTechnique(key)}
                  color={technique === key ? "primary" : "default"}
                  variant={technique === key ? "filled" : "outlined"}
                  sx={{ 
                    px: { xs: 1.5, sm: 2 }, 
                    py: { xs: 2.5, sm: 1 }, 
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                />
              );
            })}
          </Stack>
        )}

        {/* Circle UI */}
        <Box display="flex" justifyContent="center" mb={{ xs: 3, md: 4 }}>
          <Paper
            sx={{
              width: circleSize,
              height: circleSize,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: currentPhase?.color || "#ddd",
              color: "white",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
            component={motion.div}
            animate={{ scale: isActive ? 1.15 : 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              {!isActive ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: "center" }}
                >
                  <Typography variant={isMobile ? "body1" : "h6"}>Готов?</Typography>
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    Натисни започни
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key={currentPhase.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ textAlign: "center" }}
                >
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight={700} 
                    mb={1}
                  >
                    {currentPhase.text}
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h2" : "h3"} 
                    fontWeight={700}
                  >
                    {count}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </Box>

        {/* Progress Stats */}
        {isActive && (
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mb: 3, borderRadius: 3 }}
          >
            <CardContent sx={{ py: { xs: 2, md: 3 } }}>
              <Stack 
                direction="row" 
                justifyContent="space-around"
                spacing={{ xs: 2, sm: 4 }}
              >
                <Box textAlign="center">
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    color="primary"
                  >
                    {completedCycles}
                  </Typography>
                  <Typography variant="body2">Цикли</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    color="secondary"
                  >
                    {Math.floor(
                      (completedCycles *
                        currentTechnique.phases.reduce(
                          (a, p) => a + p.duration,
                          0
                        )) /
                        60
                    )}
                  </Typography>
                  <Typography variant="body2">Минути</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Box textAlign="center" mt={{ xs: 2, md: 3 }}>
          {!isActive ? (
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={startExercise}
              fullWidth={isMobile}
              sx={{ maxWidth: { xs: '100%', sm: 200 } }}
            >
              Започни
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              size={isMobile ? "medium" : "large"}
              onClick={stopExercise}
              fullWidth={isMobile}
              sx={{ maxWidth: { xs: '100%', sm: 200 } }}
            >
              Спри
            </Button>
          )}
        </Box>

        {/* Instructions */}
        {!isActive && (
          <Card sx={{ mt: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <CardContent>
              <Typography 
                variant="h6" 
                mb={1}
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Как работи?
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
              >
                • <strong>4-7-8:</strong> Успокояващо, помага за заспиване
                <br />• <strong>Box:</strong> Намалява стрес и тревожност
                <br />• <strong>5-5:</strong> Бързо релаксиране навсякъде
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default BreathingExercise;