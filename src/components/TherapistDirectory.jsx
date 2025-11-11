import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { Phone, MapPin, Award, Mail, Search, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getTherapists } from '../api';

export default function TherapistDirectory() {
  const [therapists, setTherapists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Всички градове');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Всички специалности');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (selectedCity && selectedCity !== 'Всички градове') params.city = selectedCity;
        if (selectedSpecialty && selectedSpecialty !== 'Всички специалности') params.specialty = selectedSpecialty;
        if (searchQuery) params.search = searchQuery;
        const response = await getTherapists(params);
        setTherapists(response.data);
      } catch (err) {
        setError('Грешка при зареждане на терапевтите.');
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, [selectedCity, selectedSpecialty, searchQuery]);

const cities = ['Всички градове', 'София', 'Пловдив', 'Варна', 'Бургас'];
const specialties = ['Всички специалности', 'Клиничен психолог', 'Психотерапевт', 'Детски психолог'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            fontWeight="600"
            sx={{ mb: 4 }}
          >
            Намери специалист
          </Typography>

          {/* Search and Filter Section */}
          <Box 
            sx={{ 
              mb: 6,
              p: 3,
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Търси по име или специалност..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: 'white' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Град</InputLabel>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="Град"
                    startAdornment={
                      <InputAdornment position="start">
                        <MapPin size={20} />
                      </InputAdornment>
                    }
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Специалност</InputLabel>
                  <Select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    label="Специалност"
                    startAdornment={
                      <InputAdornment position="start">
                        <Award size={20} />
                      </InputAdornment>
                    }
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Therapists Grid */}
          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <AnimatePresence>
              <Grid container spacing={3}>
                {therapists.map((therapist, index) => (
                  <Grid item xs={12} md={6} key={therapist._id || therapist.id}>
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card 
                        elevation={0}
                        sx={{ 
                          borderRadius: 4,
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item>
                              <Avatar
                                src={therapist.image}
                                sx={{ 
                                  width: 80, 
                                  height: 80,
                                  border: 2,
                                  borderColor: 'primary.light'
                                }}
                              />
                            </Grid>
                            <Grid item xs>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h5" gutterBottom fontWeight="600">
                                  {therapist.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  {therapist.specialty}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Star size={18} color="#FFB400" />
                                  <Typography variant="body2" sx={{ ml: 1 }}>
                                    {therapist.rating} ({therapist.reviews} отзива)
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                {Array.isArray(therapist.expertise) && therapist.expertise.map((exp, i) => (
                                  <Chip
                                    key={i}
                                    label={exp}
                                    size="small"
                                    sx={{ 
                                      mr: 1, 
                                      mb: 1,
                                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                                      color: 'primary.main'
                                    }}
                                  />
                                ))}
                              </Box>

                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                {therapist.city}
                              </Typography>

                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<Phone />}
                                  href={`tel:${therapist.phone}`}
                                  sx={{ 
                                    flex: 1,
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                      bgcolor: 'primary.dark'
                                    }
                                  }}
                                >
                                  {therapist.phone}
                                </Button>
                                <IconButton
                                  href={`mailto:${therapist.email}`}
                                  sx={{ 
                                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                                    color: 'primary.main',
                                    '&:hover': {
                                      bgcolor: 'rgba(99, 102, 241, 0.2)'
                                    }
                                  }}
                                >
                                  <Mail />
                                </IconButton>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>
          )}
        </motion.div>
      </Box>
    </Container>
  );
}