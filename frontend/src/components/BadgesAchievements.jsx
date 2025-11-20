import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Timer, Stars } from "lucide-react";

const MotionBox = motion(Box);

const BadgesAchievements = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0e7ff, #f5d0fe, #fbcfe8, #fee2e2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Floating Icons */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Stars size={60} color="#8b5cf6" />
        </MotionBox>

        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 5,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.4)",
            mt: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Trophy size={90} color="#f59e0b" />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                mt: 2,
                background:
                  "linear-gradient(to right, #7c3aed, #f43f5e, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Очаквайте Скоро!
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 2, color: "#4b5563", fontSize: "1.1rem" }}
            >
              Работим върху страхотна система за постижения 🎉  
              Скоро ще можеш да отключваш badges, да следиш прогреса си
              и да печелиш награди докато се развиваш!
            </Typography>

            {/* Fun animated sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 10 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ marginTop: "15px" }}
            >
              <Sparkles size={40} color="#ec4899" />
            </motion.div>

            <Button
              variant="contained"
              sx={{
                mt: 4,
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              }}
              startIcon={<Timer />}
            >
              Остава съвсем малко ⏳
            </Button>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
};

export default BadgesAchievements;
