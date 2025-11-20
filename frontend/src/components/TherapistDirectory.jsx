import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { Phone, MapPin, Award, Mail, Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TherapistDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Всички градове');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Всички специалности');

  const therapists = [
    {
      id: 1,
      name: 'Мария Иванова',
      specialty: 'Психотерапевт',
      city: 'София',
      phone: '+359888111222',
      email: 'maria@example.com',
      rating: 4.9,
      reviews: 32,
      expertise: ['Тревожност', 'Депресия', 'Семейни отношения'],
      image: ''
    },
    {
      id: 2,
      name: 'Иван Петров',
      specialty: 'Клиничен психолог',
      city: 'Пловдив',
      phone: '+359888333444',
      email: 'ivan@example.com',
      rating: 4.7,
      reviews: 21,
      expertise: ['Паник атаки', 'Стрес'],
      image: ''
    }
  ];

  const filteredTherapists = therapists.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'Всички градове' || t.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'Всички специалности' || t.specialty === selectedSpecialty;
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const cities = ['Всички градове', 'София', 'Пловдив', 'Варна', 'Бургас'];
  const specialties = ['Всички специалности', 'Клиничен психолог', 'Психотерапевт', 'Детски психолог'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h3" align="center" gutterBottom fontWeight="600" sx={{ mb: 4 }}>
            Намери специалист
          </Typography>

          <Box sx={{ mb: 6, p: 3, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Търси по име или специалност..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search size={20} /></InputAdornment>) }}
                  sx={{ bgcolor: 'white' }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Град</InputLabel>
                  <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} label="Град">
                    {cities.map((city) => (<MenuItem key={city} value={city}>{city}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Специалност</InputLabel>
                  <Select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} label="Специалност">
                    {specialties.map((spec) => (<MenuItem key={spec} value={spec}>{spec}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <AnimatePresence>
            <Grid container spacing={3}>
              {filteredTherapists.map((therapist, index) => (
                <Grid item xs={12} md={6} key={therapist.id}>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.1)', '&:hover': { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', transform: 'translateY(-4px)' } }}>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Avatar src={therapist.image} sx={{ width: 80, height: 80, border: 2, borderColor: 'primary.light' }} />
                          </Grid>

                          <Grid item xs>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h5" gutterBottom fontWeight="600">{therapist.name}</Typography>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>{therapist.specialty}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Star size={18} color="#FFB400" />
                                <Typography variant="body2" sx={{ ml: 1 }}>{therapist.rating} ({therapist.reviews} отзива)</Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              {therapist.expertise.map((exp, i) => (
                                <Chip key={i} label={exp} size="small" sx={{ mr: 1, mb: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }} />
                              ))}
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                              {therapist.city}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button variant="contained" startIcon={<Phone />} href={`tel:${therapist.phone}`} sx={{ flex: 1 }}> {therapist.phone} </Button>
                              <IconButton href={`mailto:${therapist.email}`} sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
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
        </motion.div>
      </Box>
    </Container>
  );
}
