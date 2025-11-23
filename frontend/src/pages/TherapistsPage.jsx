// src/pages/TherapistsPage.jsx - Fully Responsive
import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, useMediaQuery, useTheme, Box } from "@mui/material";
import TherapistCard from "../components/TherapistDirectory";
import api from "../services/api";

export default function TherapistsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/therapists");
        setList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading therapists:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        py: { xs: 3, sm: 4, md: 6 }
      }}
    >
      <Container sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h4" 
          mb={2}
          sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
        >
          Терапевти
        </Typography>
        <Typography 
          color="text.secondary" 
          mb={{ xs: 2, md: 3 }}
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Избери терапевт от директорията. Може да филтрираш по град/специалност.
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {list.map(t => (
            <Grid key={t._id || t.id} item xs={12} sm={6} md={4}>
              <TherapistCard therapist={t} />
            </Grid>
          ))}
        </Grid>
        
        {(!loading && list.length === 0) && (
          <Typography 
            mt={4} 
            textAlign="center"
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            Няма терапевти за показване.
          </Typography>
        )}
      </Container>
    </Box>
  );
}