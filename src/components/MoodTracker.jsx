// src/components/MoodTracker.jsx - С AI АНАЛИЗ

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Chip
} from '@mui/material';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEmotions } from '../api';
import { useAnonymous } from "../context/AnonymousContext";
import axios from 'axios';

export default function MoodTracker() {
  const { userId } = useAnonymous();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // AI анализ
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getEmotions(userId);

        const chartData = response.data
          .map(item => ({
            date: new Date(item.timestamp).toLocaleDateString('bg-BG', {
              day: 'numeric',
              month: 'short'
            }),
            mood: item.mood,
            energy: item.energy,
            timestamp: item.timestamp,
            note: item.note
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(chartData);
      } catch (err) {
        console.error("❌ Error fetching emotions:", err);
        setError('Грешка при зареждане на данните.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 🤖 AI АНАЛИЗ ФУНКЦИЯ (работи от 3+ записа)
  const analyzeWithAI = async () => {
    if (data.length < 3) {
      setError('Необходими са поне 3 записа за AI анализ.');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      // Подготовка на данните за AI
      const recentData = data.slice(-14); // последните 14 записа
      
      const avgMood = (recentData.reduce((sum, d) => sum + d.mood, 0) / recentData.length).toFixed(1);
      const avgEnergy = (recentData.reduce((sum, d) => sum + d.energy, 0) / recentData.length).toFixed(1);
      
      const moodTrend = recentData.length > 1 
        ? recentData[recentData.length - 1].mood - recentData[0].mood 
        : 0;
      
      const energyTrend = recentData.length > 1 
        ? recentData[recentData.length - 1].energy - recentData[0].energy 
        : 0;

      // Съставяне на промпт за AI
      const prompt = `Ти си професионален психолог. Анализирай следните данни за настроение и енергия на пациент за последните ${recentData.length} дни:

Средно настроение: ${avgMood}/5
Средна енергия: ${avgEnergy}/5
Тренд на настроението: ${moodTrend > 0 ? '+' : ''}${moodTrend.toFixed(1)}
Тренд на енергията: ${energyTrend > 0 ? '+' : ''}${energyTrend.toFixed(1)}

Последни записи:
${recentData.slice(-7).map(d => `${d.date}: Настроение ${d.mood}/5, Енергия ${d.energy}/5${d.note ? `, Бележка: "${d.note}"` : ''}`).join('\n')}

Дай кратък, емпатичен анализ (до 200 думи) на български език с:
1. Оценка на общото състояние
2. Забелязани тенденции
3. Конкретни препоръки за подобрение
4. Позитивна бележка или окуражаване`;

      // Извикване на API
      const response = await axios.post(
        'http://localhost:5000/api/chat/ai',
        { message: prompt }
      );

      const analysis = response.data?.reply || 'Няма отговор от AI.';
      
      setAiAnalysis(analysis);
      setShowAnalysis(true);

    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError('Грешка при генериране на анализ. Моля, опитайте отново.');
    } finally {
      setAiLoading(false);
    }
  };

  // Изчисляване на тренд (работи от 2+ записа)
  const getTrend = (dataKey) => {
    if (data.length < 2) return null; // Скриваме при < 2 записа
    
    if (data.length < 7) {
      // При 2-6 записа: сравняваме първия с последния
      const first = data[0][dataKey];
      const last = data[data.length - 1][dataKey];
      const diff = last - first;
      
      if (diff > 0.5) return { icon: TrendingUp, color: '#10b981', text: 'Подобрение' };
      if (diff < -0.5) return { icon: TrendingDown, color: '#ef4444', text: 'Спад' };
      return { icon: Minus, color: '#6b7280', text: 'Стабилно' };
    }
    
    // При 7+ записа: сравняваме последните 7 със предишните 7
    const recent = data.slice(-7);
    const older = data.slice(-14, -7);
    
    if (older.length === 0) {
      // Ако нямаме 14+ записа, сравняваме първата половина с втората
      const mid = Math.floor(data.length / 2);
      const firstHalf = data.slice(0, mid);
      const secondHalf = data.slice(mid);
      
      const firstAvg = firstHalf.reduce((sum, d) => sum + d[dataKey], 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, d) => sum + d[dataKey], 0) / secondHalf.length;
      const diff = secondAvg - firstAvg;
      
      if (diff > 0.3) return { icon: TrendingUp, color: '#10b981', text: 'Подобрение' };
      if (diff < -0.3) return { icon: TrendingDown, color: '#ef4444', text: 'Спад' };
      return { icon: Minus, color: '#6b7280', text: 'Стабилно' };
    }
    
    const recentAvg = recent.reduce((sum, d) => sum + d[dataKey], 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d[dataKey], 0) / older.length;
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.3) return { icon: TrendingUp, color: '#10b981', text: 'Подобрение' };
    if (diff < -0.3) return { icon: TrendingDown, color: '#ef4444', text: 'Спад' };
    return { icon: Minus, color: '#6b7280', text: 'Стабилно' };
  };

  const moodTrend = getTrend('mood');
  const energyTrend = getTrend('energy');

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 2,
          backdropFilter: 'blur(6px)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Дата: {payload[0].payload.date}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7b4bff' }}>
          Стойност: {payload[0].value}
        </Typography>
      </Paper>
    );
  };

  if (!userId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning">Моля, влезте, за да видите статистиката си.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }} align="center">
        📈 Промени във вашето настроение и енергичност
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : data.length === 0 ? (
        <Alert severity="info">
          Няма записани данни. Започнете да споделяте емоциите си! 😊
        </Alert>
      ) : (
        <>
          {/* ---------- AI АНАЛИЗ БУТОН (показва се при 3+ записа) ---------- */}
          {data.length >= 3 && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Brain />}
                  onClick={analyzeWithAI}
                  disabled={aiLoading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: 'linear-gradient(45deg, #7b4bff 30%, #00d4ff 90%)',
                    boxShadow: '0 4px 20px rgba(123,75,255,0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 30px rgba(123,75,255,0.4)',
                    }
                  }}
                >
                  {aiLoading ? 'Анализирам...' : ' AI Анализ на напредъка'}
                </Button>
              </motion.div>
            </Box>
          )}

          {/* ---------- AI АНАЛИЗ РЕЗУЛТАТ ---------- */}
          {showAnalysis && aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(40px)'
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                    <Brain size={32} style={{ marginRight: 12 }} />
                    <Typography variant="h5" fontWeight="700">
                      AI Психологичен Анализ
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: '1.05rem',
                      whiteSpace: 'pre-line',
                      textAlign: 'center'   // <<< ТУК ДОБАВИХ ЦЕНТРИРАН ТЕКСТ
                    }}
                  >
                    {aiAnalysis}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* ---------- ТРЕНД ИНДИКАТОРИ (показват се при 2+ записа) ---------- */}
          {moodTrend && energyTrend && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mb: 4,
                flexWrap: 'wrap'
              }}
            >
              {/* ТРЕНД НА НАСТРОЕНИЕТО */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  width: 300
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  😊 Тренд на настроението
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <moodTrend.icon size={32} color={moodTrend.color} />
                  <Chip
                    label={moodTrend.text}
                    sx={{
                      fontWeight: 600,
                      bgcolor: `${moodTrend.color}20`,
                      color: moodTrend.color
                    }}
                  />
                </Box>
              </Paper>

              {/* ТРЕНД НА ЕНЕРГИЯТА */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  width: 300
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  ⚡ Тренд на енергията
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <energyTrend.icon size={32} color={energyTrend.color} />
                  <Chip
                    label={energyTrend.text}
                    sx={{
                      fontWeight: 600,
                      bgcolor: `${energyTrend.color}20`,
                      color: energyTrend.color
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}
          
          {/* ---------- ГРАФИКИ ---------- */}
          <Grid container spacing={4}>
            {/* ГРАФИКА 1: НАСТРОЕНИЕ */}
            <Grid item xs={12} md={6} lg={6} xl={6} sx={{ minWidth: '575px' }}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f4f4ff 100%)'
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 600 }}>
                  😊 Настроение
                </Typography>

                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#7b4bff"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#fff', strokeWidth: 2, stroke: '#7b4bff' }}
                        activeDot={{ r: 9 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* ГРАФИКА 2: ЕНЕРГИЯ */}
            <Grid item xs={12} md={6} lg={6} xl={6} sx={{ minWidth: '575px' }}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #eafff4 100%)'
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 600 }}>
                  ⚡ Енергичност
                </Typography>

                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#fff', strokeWidth: 2, stroke: '#10b981' }}
                        activeDot={{ r: 9 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}