import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Paper, Typography, TextField, IconButton,
  Button, Chip, Stack, Card, CardContent, Divider, Avatar,
  Snackbar, Alert, Grid
} from '@mui/material';
import {
  BookOpen, Sparkles, Save, RefreshCw, Tag as TagIcon,
  Lock, Unlock, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveJournalEntry } from "../services/api";

const AIJournal = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [entry, setEntry] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [entries, setEntries] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);

  // AI-Generated Prompts based on mood and context
  const aiPrompts = [
    {
      category: 'reflection',
      prompts: [
        'Каква е една малка победа от миналата седмица, за която си горд/а?',
        'Какво те направи щастлив/а днес?',
        'Кой беше най-важният разговор днес и защо?',
        'Какво научи за себе си тази седмица?',
        'Опиши един момент от днес, когато се почувства наистина себе си.'
      ]
    },
    {
      category: 'gratitude',
      prompts: [
        'За какво си благодарен/а днес?',
        'Кой човек направи деня ти по-добър и как?',
        'Какво малко нещо те зарадва днес?',
        'Запиши три неща, които ценяваш в момента.',
        'Каква е една способност/умение, за което си благодарен/а?'
      ]
    },
    {
      category: 'growth',
      prompts: [
        'Каква е една промяна, която искаш да направиш?',
        'Какво предизвикателство преодоля напоследък?',
        'В коя област искаш да растеш повече?',
        'Какво би направил/а днес, ако нямаше страх?',
        'Как днешният ти аз може да помогне на бъдещия ти аз?'
      ]
    },
    {
      category: 'emotions',
      prompts: [
        'Как се чувстваш в момента и защо?',
        'Коя емоция те изненада днес?',
        'Какво ти е нужно, за да се почувстваш по-добре?',
        'Опиши настроението си с три думи.',
        'Какво искаше да кажеш днес, но не каза?'
      ]
    },
    {
      category: 'creativity',
      prompts: [
        'Ако днешният ти ден беше цвят, какъв би бил?',
        'Напиши кратка история за нещо, което те вдъхнови.',
        'Какво би казал на себе си преди 5 години?',
        'Опиши перфектния си ден от началото до края.',
        'Какво мечтаеш да постигнеш през следващата година?'
      ]
    }
  ];

  // Mock entries for demo
  const mockEntries = [
    {
      id: 1,
      date: '21 Ноември 2025',
      prompt: 'Какво те направи щастлив/а днес?',
      content: 'Днес имах чудесен разговор с приятел… Беше зареждащо и ме накара да се усмихна истински.',
      tags: ['приятели', 'щастие'],
      isPrivate: true,
      wordCount: 45
    },
    {
      id: 2,
      date: '20 Ноември 2025',
      prompt: 'За какво си благодарен/а днес?',
      content: 'Благодарен съм за слънчевото време и кратката разходка в парка — успя да ми изчисти главата.',
      tags: ['благодарност', 'природа'],
      isPrivate: true,
      wordCount: 62
    }
  ];

  const contentRef = useRef(null);

  useEffect(() => {
    // initialize
    setEntries(mockEntries);
    generateNewPrompt();
  }, []);

  useEffect(() => {
    const words = entry.trim().length === 0
      ? 0
      : entry.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [entry]);

  const generateNewPrompt = () => {
    const allPrompts = aiPrompts.flatMap(cat => cat.prompts);
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

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
  const res = await saveJournalEntry(newEntry);

  const entry = {
    ...res.data.entry,
    tags: res.data.entry?.tags ?? []
  };

  setEntries(prev => [entry, ...prev]);

  setSaveOpen(true);
  setEntry("");
  setTags(entry.tags); // ← правилно!
  generateNewPrompt();

} catch (err) {
  console.error("Save error:", err);
}

    // optional: scroll to top of entries
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 88,
              height: 88,
              mx: 'auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.35)'
            }}
          >
            <BookOpen size={36} color="white" />
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>
            Моят AI Дневник
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
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
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            mb: 4,
            border: '2px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,252,0.85))'
          }}
        >
          {/* Prompt Row */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(90deg, rgba(243,244,255,0.8), rgba(252,245,255,0.8))',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Avatar sx={{
                  bgcolor: 'transparent',
                  width: 44,
                  height: 44,
                  mt: '2px',
                  background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                  boxShadow: '0 6px 20px rgba(167,139,250,0.18)'
                }}>
                  <Sparkles size={20} color="white" />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    💡 AI Подкана за днес:
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                    "{currentPrompt}"
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={generateNewPrompt}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}
                  aria-label="Нова подкана"
                >
                  <RefreshCw />
                </IconButton>

                <Button
                  onClick={() => {
                    // quick sample to insert prompt into editor (optional)
                    setEntry(prev => prev ? prev + '\n\n' + currentPrompt : currentPrompt);
                  }}
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Вмъкни подкана
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Writing Area */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  inputRef={contentRef}
                  multiline
                  minRows={8}
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
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderWidth: 2 }
                    }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {wordCount} думи
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {entry.length > 0 ? '✍️ Пишеш...' : ''}
                  </Typography>
                </Box>

                {/* Tags */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>🏷️ Тагове</Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                    {tags.map((t) => (
                      <Chip
                        key={t}
                        label={`#${t}`}
                        onDelete={() => removeTag(t)}
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        deleteIcon={<TagIcon />}
                      />
                    ))}
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Добави таг... (натисни Enter)"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Добави
                    </Button>
                  </Box>
                </Box>

                {/* Privacy & Save */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Box>
                    <Button
                      onClick={() => setIsPrivate(p => !p)}
                      startIcon={isPrivate ? <Lock /> : <Unlock />}
                      variant={isPrivate ? 'outlined' : 'contained'}
                      sx={{ borderRadius: 2 }}
                    >
                      {isPrivate ? 'Личен' : 'Публичен'}
                    </Button>
                  </Box>

                  <Box>
                    <Button
                      onClick={handleSaveEntry}
                      disabled={!entry.trim()}
                      startIcon={<Save />}
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        background: entry.trim() ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : undefined
                      }}
                    >
                      Запази запис
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right column: quick actions / tips */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Бързи действия
                  </Typography>
                  <Stack spacing={1}>
                    <Button onClick={() => setEntry('')} variant="outlined">Изчисти текст</Button>
                    <Button onClick={() => setEntry(prev => prev + '\n\n' + 'Благодарности: ')} variant="outlined">Добави структура</Button>
                    <Button onClick={() => {
                      const sample = "Днес бях благодарен/на за...";
                      setEntry(prev => prev ? prev + '\n\n' + sample : sample);
                    }} variant="outlined">Вмъкни пример</Button>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Съвет
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Пиши свободно — не се притеснявай за граматика. Запазвай редовно и използвай тагове, за да филтрираш по теми.
                  </Typography>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Previous entries */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={20} /> Предишни записи
          </Typography>

          <Stack spacing={2}>
            <AnimatePresence>
              {entries.map((e, i) => (
                <motion.div
                  key={e.id || e._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card variant="outlined" sx={{
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(2,6,23,0.04)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Calendar size={16} />
                          <Typography variant="caption" color="text.secondary">{e.date}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {e.isPrivate ? <Lock size={14} color="#6b7280" /> : <Unlock size={14} color="#2563eb" />}
                          <Typography variant="caption" color="text.secondary">{e.wordCount} думи</Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                        💡 "{e.prompt}"
                      </Typography>

                      <Typography variant="body1" color="text.primary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                        {e.content}
                      </Typography>

                      {e.tags?.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {e.tags.map((t, idx) => (
                            <Chip key={idx} label={`#${t}`} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {entries.length === 0 && (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <BookOpen size={36} color="#9ca3af" />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Още нямаш записи в дневника. Започни да пишеш, за да видиш историята си тук!
                </Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      </motion.div>

      {/* Save snackbar */}
      <Snackbar open={saveOpen} autoHideDuration={1800} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Записът е запазен!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIJournal;
