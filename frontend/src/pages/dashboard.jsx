// src/pages/Dashboard.jsx - Fully Responsive
import React from "react";
import { Container, Grid, Typography, Card, CardContent, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wind, Trophy, AlertCircle } from "lucide-react";

const cards = [
  {
    title: "Упражнения за Дишане",
    description: "Успокой ума с контролирано дишане.",
    link: "/breathing",
    icon: Wind,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    title: "Постижения",
    description: "Виж своя прогрес и спечелени значки.",
    link: "/badges",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    title: "Кризисни Ресурси",
    description: "Получи мигновенна помощ и подкрепа.",
    link: "/crisis",
    icon: AlertCircle,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  }
];

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef4ff 0%, #e0e7ff 100%)',
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: { xs: 3, sm: 4, md: 6 },
            fontWeight: 700,
            color: '#2a4a7b',
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Твоята Дъска
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    component={Link}
                    to={card.link}
                    sx={{
                      textDecoration: 'none',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: { xs: 3, md: 4 },
                      background: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: { xs: 100, sm: 120, md: 140 },
                        background: card.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={48} color="white" />
                    </Box>

                    <CardContent sx={{ 
                      p: { xs: 2, sm: 2.5, md: 3 },
                      flexGrow: 1 
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 700,
                          color: '#1e3d73',
                          fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                          lineHeight: 1.5
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}