// src/components/MoodTracker.jsx - Responsive + AI Анализ

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Brain, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getEmotions } from "../services/api";
import { useAnonymous } from "../context/AnonymousContext";
import axios from "axios";

export default function MoodTracker() {
  const { userId } = useAnonymous();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI анализ
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Отделни AI анализи за настроение и енергия
  const [moodAnalysis, setMoodAnalysis] = useState("");
  const [energyAnalysis, setEnergyAnalysis] = useState("");
  const [moodAiLoading, setMoodAiLoading] = useState(false);
  const [energyAiLoading, setEnergyAiLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const emotions = await getEmotions(userId);

        console.log("📊 Emotions:", emotions);

        if (!Array.isArray(emotions)) {
          console.error("❌ Backend returned not an array:", emotions);
          return;
        }

        const chartData = emotions
          .map((item) => ({
            date: new Date(item.timestamp || item.date).toLocaleDateString("bg-BG", {
              day: "numeric",
              month: "short",
            }),
            mood: item.mood,
            energy: item.energy,
            timestamp: item.timestamp || item.date,
            note: item.note,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(chartData);
      } catch (err) {
        console.error("❌ Error fetching emotions:", err);
        setError("Грешка при зареждане на данните.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 🤖 ОБЩ AI АНАЛИЗ
  const analyzeWithAI = async () => {
    if (data.length < 3) {
      setError("Необходими са поне 3 записа за AI анализ.");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const recentData = data.slice(-14);

      const avgMood = (recentData.reduce((sum, d) => sum + d.mood, 0) / recentData.length).toFixed(
        1
      );
      const avgEnergy = (
        recentData.reduce((sum, d) => sum + d.energy, 0) / recentData.length
      ).toFixed(1);

      const moodTrend =
        recentData.length > 1 ? recentData[recentData.length - 1].mood - recentData[0].mood : 0;

      const energyTrend =
        recentData.length > 1 ? recentData[recentData.length - 1].energy - recentData[0].energy : 0;

      const prompt = `Ти си професионален психолог. Анализирай следните данни за настроение и енергия на пациент за последните ${recentData.length} дни:

Средно настроение: ${avgMood}/5
Средна енергия: ${avgEnergy}/5
Тренд на настроението: ${moodTrend > 0 ? "+" : ""}${moodTrend.toFixed(1)}
Тренд на енергията: ${energyTrend > 0 ? "+" : ""}${energyTrend.toFixed(1)}

Последни записи:
${recentData
  .slice(-7)
  .map(
    (d) =>
      `${d.date}: Настроение ${d.mood}/5, Енергия ${d.energy}/5${d.note ? `, Бележка: "${d.note}"` : ""}`
  )
  .join("\n")}

Дай кратък, емпатичен анализ (до 200 думи) на български език с:
1. Оценка на общото състояние
2. Забелязани тенденции
3. Конкретни препоръки за подобрение
4. Позитивна бележка или окуражаване`;

      const response = await axios.post("/api/chat/ai", { message: prompt });

      const analysis = response.data?.reply || "Няма отговор от AI.";

      setAiAnalysis(analysis);
      setShowAnalysis(true);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Грешка при генериране на анализ. Моля, опитайте отново.");
    } finally {
      setAiLoading(false);
    }
  };

  // 🎭 AI АНАЛИЗ НА НАСТРОЕНИЕТО
  const analyzeMoodWithAI = async () => {
    if (data.length < 2) {
      setError("Необходими са поне 2 записа за анализ.");
      return;
    }

    setMoodAiLoading(true);
    setError("");

    try {
      const recentData = data.slice(-14);
      const avgMood = (recentData.reduce((sum, d) => sum + d.mood, 0) / recentData.length).toFixed(
        1
      );
      const minMood = Math.min(...recentData.map((d) => d.mood));
      const maxMood = Math.max(...recentData.map((d) => d.mood));
      const moodVariance = (maxMood - minMood).toFixed(1);

      const prompt = `Ти си психолог специалист по емоционално здраве. Анализирай САМО настроението на пациент:

Средно настроение: ${avgMood}/5
Минимално: ${minMood}/5, Максимално: ${maxMood}/5
Вариация: ${moodVariance} точки

Последни ${Math.min(7, recentData.length)} записа:
${recentData
  .slice(-7)
  .map((d) => `${d.date}: ${d.mood}/5${d.note ? ` - "${d.note}"` : ""}`)
  .join("\n")}

Дай кратък анализ (до 100 думи) на български:
- Какво показва настроението?
- Има ли притеснителни модели?
- Една конкретна препоръка за подобрение на настроението.`;

      const response = await axios.post("/api/chat/ai", { message: prompt });

      setMoodAnalysis(response.data?.reply || "Няма отговор.");
    } catch (err) {
      console.error("Mood AI Error:", err);
      setError("Грешка при анализ на настроението.");
    } finally {
      setMoodAiLoading(false);
    }
  };

  // ⚡ AI АНАЛИЗ НА ЕНЕРГИЯТА
  const analyzeEnergyWithAI = async () => {
    if (data.length < 2) {
      setError("Необходими са поне 2 записа за анализ.");
      return;
    }

    setEnergyAiLoading(true);
    setError("");

    try {
      const recentData = data.slice(-14);
      const avgEnergy = (
        recentData.reduce((sum, d) => sum + d.energy, 0) / recentData.length
      ).toFixed(1);
      const minEnergy = Math.min(...recentData.map((d) => d.energy));
      const maxEnergy = Math.max(...recentData.map((d) => d.energy));

      const prompt = `Ти си специалист по енергиен мениджмънт и wellness. Анализирай САМО енергийните нива на пациент:

Средна енергия: ${avgEnergy}/5
Минимална: ${minEnergy}/5, Максимална: ${maxEnergy}/5

Последни ${Math.min(7, recentData.length)} записа:
${recentData
  .slice(-7)
  .map((d) => `${d.date}: Енергия ${d.energy}/5`)
  .join("\n")}

Дай кратък анализ (до 100 думи) на български:
- Какво показват енергийните нива?
- Има ли признаци на изтощение или дисбаланс?
- Една конкретна препоръка за повишаване на енергията (сън, хранене, движение).`;

      const response = await axios.post("/api/chat/ai", { message: prompt });

      setEnergyAnalysis(response.data?.reply || "Няма отговор.");
    } catch (err) {
      console.error("Energy AI Error:", err);
      setError("Грешка при анализ на енергията.");
    } finally {
      setEnergyAiLoading(false);
    }
  };

  // Изчисляване на тренд
  const getTrend = (dataKey) => {
    if (data.length < 2) return null;

    if (data.length < 7) {
      const first = data[0][dataKey];
      const last = data[data.length - 1][dataKey];
      const diff = last - first;

      if (diff > 0.5) return { icon: TrendingUp, color: "#10b981", text: "Подобрение" };
      if (diff < -0.5) return { icon: TrendingDown, color: "#ef4444", text: "Спад" };
      return { icon: Minus, color: "#6b7280", text: "Стабилно" };
    }

    const recent = data.slice(-7);
    const older = data.slice(-14, -7);

    if (older.length === 0) {
      const mid = Math.floor(data.length / 2);
      const firstHalf = data.slice(0, mid);
      const secondHalf = data.slice(mid);

      const firstAvg = firstHalf.reduce((sum, d) => sum + d[dataKey], 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, d) => sum + d[dataKey], 0) / secondHalf.length;
      const diff = secondAvg - firstAvg;

      if (diff > 0.3) return { icon: TrendingUp, color: "#10b981", text: "Подобрение" };
      if (diff < -0.3) return { icon: TrendingDown, color: "#ef4444", text: "Спад" };
      return { icon: Minus, color: "#6b7280", text: "Стабилно" };
    }

    const recentAvg = recent.reduce((sum, d) => sum + d[dataKey], 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d[dataKey], 0) / older.length;
    const diff = recentAvg - olderAvg;

    if (diff > 0.3) return { icon: TrendingUp, color: "#10b981", text: "Подобрение" };
    if (diff < -0.3) return { icon: TrendingDown, color: "#ef4444", text: "Спад" };
    return { icon: Minus, color: "#6b7280", text: "Стабилно" };
  };

  const moodTrend = getTrend("mood");
  const energyTrend = getTrend("energy");

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 2,
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Дата: {payload[0].payload.date}
        </Typography>
        <Typography variant="body2" sx={{ color: "#7b4bff" }}>
          Стойност: {payload[0].value}
        </Typography>
      </Paper>
    );
  };

  if (!userId) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="warning">Моля, влезте, за да видите статистиката си.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 700 }} align="center">
        📈 Промени във вашето настроение и енергичност
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : data.length === 0 ? (
        <Alert severity="info">Няма записани данни. Започнете да споделяте емоциите си! 😊</Alert>
      ) : (
        <>
          {/* ---------- ОБЩ AI АНАЛИЗ БУТОН ---------- */}
          {data.length >= 3 && (
            <Box sx={{ mb: 4, textAlign: "center" }}>
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
                    fontSize: "1rem",
                    background: "linear-gradient(45deg, #7b4bff 30%, #00d4ff 90%)",
                    boxShadow: "0 4px 20px rgba(123,75,255,0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 30px rgba(123,75,255,0.4)",
                    },
                  }}
                >
                  {aiLoading ? "Анализирам..." : "🧠 Пълен AI Анализ"}
                </Button>
              </motion.div>
            </Box>
          )}

          {/* ---------- ОБЩ AI АНАЛИЗ РЕЗУЛТАТ ---------- */}
          {showAnalysis && aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, md: 4 },
                  mb: 4,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    filter: "blur(40px)",
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "center" }}
                  >
                    <Brain size={32} style={{ marginRight: 12 }} />
                    <Typography variant="h5" fontWeight="700">
                      AI Психологичен Анализ
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: "1.05rem",
                      whiteSpace: "pre-line",
                      textAlign: "center",
                    }}
                  >
                    {aiAnalysis}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* ---------- ТРЕНД ИНДИКАТОРИ ---------- */}
          {moodTrend && energyTrend && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: 2, md: 4 },
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              <Paper sx={{ p: 2, borderRadius: 3, textAlign: "center", minWidth: 150 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  😊 Настроение
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                >
                  <moodTrend.icon size={24} color={moodTrend.color} />
                  <Chip
                    label={moodTrend.text}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: `${moodTrend.color}20`,
                      color: moodTrend.color,
                    }}
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 3, textAlign: "center", minWidth: 150 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  ⚡ Енергия
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                >
                  <energyTrend.icon size={24} color={energyTrend.color} />
                  <Chip
                    label={energyTrend.text}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: `${energyTrend.color}20`,
                      color: energyTrend.color,
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}

          {/* ---------- ГРАФИКИ - RESPONSIVE GRID ---------- */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* ГРАФИКА 1: НАСТРОЕНИЕ */}
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                background: "linear-gradient(135deg, #ffffff 0%, #f4f4ff 100%)",
              }}
            >
              <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 600 }}>
                😊 Настроение
              </Typography>

              <Box sx={{ width: "100%", height: { xs: 250, md: 300 } }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#7b4bff"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#fff", strokeWidth: 2, stroke: "#7b4bff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* AI бутон за настроение */}
              {data.length >= 2 && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Sparkles size={16} />}
                    onClick={analyzeMoodWithAI}
                    disabled={moodAiLoading}
                    sx={{
                      borderColor: "#7b4bff",
                      color: "#7b4bff",
                      "&:hover": { borderColor: "#5a2bdf", bgcolor: "rgba(123,75,255,0.05)" },
                    }}
                  >
                    {moodAiLoading ? "Анализирам..." : "AI Анализ"}
                  </Button>
                </Box>
              )}

              {/* AI анализ резултат за настроение */}
              {moodAnalysis && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(123,75,255,0.08)",
                    border: "1px solid rgba(123,75,255,0.2)",
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {moodAnalysis}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* ГРАФИКА 2: ЕНЕРГИЯ */}
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                background: "linear-gradient(135deg, #ffffff 0%, #eafff4 100%)",
              }}
            >
              <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 600 }}>
                ⚡ Енергичност
              </Typography>

              <Box sx={{ width: "100%", height: { xs: 250, md: 300 } }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#fff", strokeWidth: 2, stroke: "#10b981" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* AI бутон за енергия */}
              {data.length >= 2 && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Sparkles size={16} />}
                    onClick={analyzeEnergyWithAI}
                    disabled={energyAiLoading}
                    sx={{
                      borderColor: "#10b981",
                      color: "#10b981",
                      "&:hover": { borderColor: "#059669", bgcolor: "rgba(16,185,129,0.05)" },
                    }}
                  >
                    {energyAiLoading ? "Анализирам..." : "AI Анализ"}
                  </Button>
                </Box>
              )}

              {/* AI анализ резултат за енергия */}
              {energyAnalysis && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {energyAnalysis}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
