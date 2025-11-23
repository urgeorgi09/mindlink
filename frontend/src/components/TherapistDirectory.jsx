// src/components/TherapistCard.jsx - Fully Responsive
import React from "react";
import { Card, CardContent, Typography, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TherapistCard({ therapist, compact = false }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      onClick={() => navigate(`/therapists/${therapist._id || therapist.id}`)}
      sx={{
        cursor: "pointer",
        borderRadius: { xs: 2, md: 3 },
        boxShadow: 2,
        height: '100%',
        "&:hover": { 
          boxShadow: 6, 
          transform: isMobile ? 'none' : 'translateY(-4px)' 
        },
        transition: "all .18s ease"
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={{ xs: 1, sm: 0 }}
        >
          <Box flex={1}>
            <Typography 
              variant={compact ? "subtitle1" : "h6"} 
              fontWeight={600}
              sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: compact ? '1rem' : '1.25rem' } }}
            >
              {therapist.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              {therapist.specialty} • {therapist.city}
            </Typography>
          </Box>

          <Box 
            textAlign={{ xs: 'left', sm: 'right' }}
            mt={{ xs: 1, sm: 0 }}
          >
            <Typography 
              variant="subtitle2"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {therapist.rating?.toFixed?.(1) ?? "-"}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
            >
              {therapist.experience ? `${therapist.experience} г.` : ""}
            </Typography>
          </Box>
        </Box>

        {!compact && (
          <Box mt={2}>
            <Button 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
              fullWidth={isMobile}
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/therapists/${therapist._id || therapist.id}`); 
              }}
              sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Виж профил
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}