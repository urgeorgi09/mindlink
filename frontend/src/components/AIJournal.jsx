// src/components/AIJournal.jsx - Full Width Writing Area
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Paper, Typography, TextField, IconButton,
  Button, Chip, Stack, Card, CardContent, Divider, Avatar,
  Snackbar, Alert, Grid, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import {
  BookOpen, Sparkles, Save, RefreshCw, Tag as TagIcon,
  Lock, Unlock, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveJournalEntry, getJournalEntries, getAIResponse } from "../services/api";
import { getOrCreateUserId } from '../utils/userId';

const AIJournal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [userId] = useState(() => getOrCreateUserId());
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [entry, setEntry] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [entries, setEntries] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [error, setError] = useState('');

  const contentRef = useRef(null);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Няма дата';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Невалидна дата';
      return date.toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Грешка в датата';
    }
  };

  const generateNewPrompt = async () => {
    setPromptLoading(true);
    
    try {
      const aiPromptRequest = `Ти си терапевт и life coach. Генерирай ЕДИН кратък въпрос за дневник на български език. 
      
Въпросът трябва да е:
- За саморефлексия, благодарност, емоции или личностно развитие
- Кратък (до 15 думи)
- Вдъхновяващ и позитивен
- На български език

Категории за избор (избери произволна):
- Рефлексия за деня
- Благодарност
- Емоции и чувства
- Личностен растеж
- Цели и мечти
- Взаимоотношения

Отговори САМО с въпроса, без допълнителен текст или обяснения.`;

      const response = await getAIResponse(aiPromptRequest);
      const newPrompt = response.reply || response;
      
      const cleanPrompt = newPrompt
        .replace(/^["']|["']$/g, '')
        .replace(/^\d+\.\s*/, '')
        .trim();
      
      setCurrentPrompt(cleanPrompt || 'Как се чувстваш днес?');
      
    } catch (err) {
      console.error('❌ Error generating prompt:', err);
      const fallbackPrompts = [
        'Как се чувстваш в момента?',
        'За какво си благодарен/а днес?',
        'Какво те направи щастлив/а днес?',
        'Какво научи за себе си тази седмица?',
        'Какво искаш да постигнеш утре?'
      ];
      const randomPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
      setCurrentPrompt(randomPrompt);
    } finally {
      setPromptLoading(false);
    }
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const res = await getJournalEntries();
        const journalEntries = res.entries || res || [];
        setEntries(journalEntries);
      } catch (err) {
        console.error('❌ Error loading journal entries:', err);
        setError('Грешка при зареждане на записите');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
    generateNewPrompt();
  }, []);

  useEffect(() => {
    const words = entry.trim().length === 0
      ? 0
      : entry.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [entry]);

  const handleSaveEntry = async () => {
    if (!entry.trim()) return;

    const newEntry = {
      prompt: currentPrompt,
      content: entry,
      tags,
      isPrivate,
      wordCount
    };

    try {
      setIsLoading(true);
      const res = await saveJournalEntry(newEntry);
      
      const savedEntry = {
        ...res.entry,
        tags: res.entry?.tags ?? []
      };

      setEntries(prev => [savedEntry, ...prev]);
      setSaveOpen(true);
      setEntry("");
      setTags([]);
      generateNewPrompt();

    } catch (err) {
      console.error("Save error:", err);
      setError('Грешка при запазване на записа');
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (t) => {
    setTags(prev => prev.filter(tag => tag !== t));
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSaveOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              width: { xs: 70, md: 88 },
              height: { xs: 70, md: 88 },
              mx: 'auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.35)'
            }}
          >
            <BookOpen size={isMobile ? 30 : 36} color="white" />
          </Box>

          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mt: 2,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Моят AI Дневник
          </Typography>
          <Typography 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Ежедневни AI подкани за саморефлексия и личностен растеж
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: 4,
            border: '2px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,252,0.85))'
          }}
        >
          {/* Prompt Row */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between'
            }}>
              {/* AI Prompt */}
              <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(90deg, rgba(243,244,255,0.8), rgba(252,245,255,0.8))',
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 80,
                flex: 1
              }}>
                <Avatar sx={{
                  bgcolor: 'transparent',
                  width: { xs: 40, md: 44 },
                  height: { xs: 40, md: 44 },
                  mt: '2px',
                  background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                  boxShadow: '0 6px 20px rgba(167,139,250,0.18)'
                }}>
                  <Sparkles size={isMobile ? 18 : 20} color="white" />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    💡 AI Подкана за днес:
                  </Typography>
                  {promptLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Генерирам въпрос...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mt: 0.5, 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                      }}
                    >
                      "{currentPrompt}"
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack 
                direction={{ xs: 'row', sm: 'row' }} 
                spacing={1}
                sx={{ 
                  alignSelf: { xs: 'stretch', sm: 'center' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <IconButton
                  onClick={generateNewPrompt}
                  disabled={promptLoading}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    flex: { xs: 1, sm: 0 }
                  }}
                >
                  {promptLoading ? <CircularProgress size={24} /> : <RefreshCw size={isMobile ? 20 : 24} />}
                </IconButton>

                <Button
                  onClick={() => {
                    setEntry(prev => prev ? prev + '\n\n' + currentPrompt : currentPrompt);
                  }}
                  variant="contained"
                  disabled={promptLoading}
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    borderRadius: 2,
                    flex: { xs: 2, sm: 0 },
                    fontSize: { xs: '0.6rem', sm: '0.7rem' }
                  }}
                >
                  Вмъкни подкана
                </Button>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Full Width Writing Area */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              inputRef={contentRef}
              multiline
              minRows={isMobile ? 6 : 8}
              maxRows={18}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Започни да пишеш мислите си тук..."
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {wordCount} думи
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {entry.length > 0 ? '✍️ Пишеш...' : ''}
              </Typography>
            </Box>

            {/* Tags */}
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                🏷️ Тагове
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {tags.map((t) => (
                  <Chip
                    key={t}
                    label={`#${t}`}
                    onDelete={() => removeTag(t)}
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ mr: 0.5, mb: 0.5 }}
                    deleteIcon={<TagIcon size={16} />}
                  />
                ))}
              </Stack>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Добави таг... (натисни Enter)"
                  size={isMobile ? "small" : "medium"}
                  sx={{ flex: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddTag}
                  size={isMobile ? "small" : "medium"}
                >
                  Добави
                </Button>
              </Box>
            </Box>

            {/* Privacy & Save */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 1 },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 1 
            }}>
              <Button
                onClick={() => setIsPrivate(p => !p)}
                startIcon={isPrivate ? <Lock size={18} /> : <Unlock size={18} />}
                variant={isPrivate ? 'outlined' : 'contained'}
                size={isMobile ? "medium" : "large"}
                sx={{ borderRadius: 2 }}
              >
                {isPrivate ? 'Личен' : 'Публичен'}
              </Button>

              <Button
                onClick={handleSaveEntry}
                disabled={!entry.trim() || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Save size={18} />}
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 2,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  background: entry.trim() ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : undefined
                }}
              >
                {isLoading ? 'Запазване...' : 'Запази запис'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Previous entries */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            <Calendar size={isMobile ? 18 : 20} /> Предишни записи
          </Typography>

          {isLoading && entries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Зареждане...</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {entries.map((e, i) => (
                  <motion.div
                    key={e._id || e.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card variant="outlined" sx={{
                      borderRadius: { xs: 2, md: 3 },
                      boxShadow: '0 10px 30px rgba(2,6,23,0.04)'
                    }}>
                      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between', 
                          mb: 1,
                          gap: { xs: 1, sm: 0 }
                        }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Calendar size={14} />
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                            >
                              {formatDate(e.date || e.createdAt)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {e.isPrivate ? <Lock size={14} color="#6b7280" /> : <Unlock size={14} color="#2563eb" />}
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                            >
                              {e.wordCount || 0} думи
                            </Typography>
                          </Box>
                        </Box>

                        {e.prompt && (
                          <Typography 
                            variant="body2" 
                            color="primary" 
                            sx={{ 
                              fontWeight: 700, 
                              mb: 1,
                              fontSize: { xs: '0.85rem', sm: '0.95rem' }
                            }}
                          >
                            💡 "{e.prompt}"
                          </Typography>
                        )}

                        <Typography 
                          variant="body1" 
                          color="text.primary" 
                          sx={{ 
                            mb: 1, 
                            whiteSpace: 'pre-wrap',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          {e.content}
                        </Typography>

                        {e.tags?.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {e.tags.map((t, idx) => (
                              <Chip 
                                key={idx} 
                                label={`#${t}`} 
                                size="small" 
                                variant="outlined" 
                                sx={{ mr: 0.5, mb: 0.5 }} 
                              />
                            ))}
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {entries.length === 0 && !isLoading && (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <BookOpen size={36} color="#9ca3af" />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Още нямаш записи в дневника. Започни да пишеш!
                  </Typography>
                </Paper>
              )}
            </Stack>
          )}
        </Box>
      </motion.div>

      {/* Save snackbar */}
      <Snackbar 
        open={saveOpen} 
        autoHideDuration={2000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          ✅ Записът е запазен успешно!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIJournal;