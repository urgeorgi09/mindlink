// src/components/AiChat.jsx - Compact Version
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, IconButton, 
  Container, Avatar, CircularProgress, Skeleton, useMediaQuery, useTheme 
} from '@mui/material';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';

const Message = ({ message, isAi, isMobile }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isAi ? 'flex-start' : 'flex-end',
          mb: { xs: 2, md: 3 },
        }}
      >
        {isAi && (
          <Avatar
            sx={{
              bgcolor: 'transparent',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: { xs: 1, sm: 2 },
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Bot size={isMobile ? 20 : 24} />
          </Avatar>
        )}
        
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: '80%', sm: '75%' },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            borderRadius: { xs: 2, md: 3 },
            bgcolor: isAi ? 'background.paper' : 'transparent',
            background: isAi 
              ? 'white' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: isAi ? 'text.primary' : 'white',
            boxShadow: isAi 
              ? '0 2px 12px rgba(0, 0, 0, 0.08)' 
              : '0 4px 16px rgba(102, 126, 234, 0.4)',
            border: isAi ? '1px solid' : 'none',
            borderColor: isAi ? 'divider' : 'transparent',
            position: 'relative',
            '&::before': (isAi && !isMobile) ? {
              content: '""',
              position: 'absolute',
              left: -8,
              top: 16,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid white',
            } : {}
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
            }}
          >
            {message}
          </Typography>
        </Paper>

        {!isAi && (
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              ml: { xs: 1, sm: 2 },
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
            }}
          >
            <User size={isMobile ? 20 : 24} />
          </Avatar>
        )}
      </Box>
    </motion.div>
  );
};

export default function AiChat() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { message, setMessage, loading, sending, sendMessage } = useChat();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isAi: false
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    const aiResponse = await sendMessage(userMessage.text);

    if (aiResponse) {
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponse,
        isAi: true
      };

      setMessages(prev => [...prev, aiMsg]);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🔽 НАМАЛЕНА ВИСОЧИНА - от 60vh/500px/600px на 45vh/380px/450px
  const chatHeight = isMobile ? '45vh' : isTablet ? '380px' : '450px';
  const iconSize = isMobile ? 32 : isTablet ? 36 : 40;
  const circleSize = isMobile ? 60 : isTablet ? 70 : 80;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 0 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)' },
                    '50%': { boxShadow: '0 10px 60px rgba(102, 126, 234, 0.6)' }
                  }
                }}
              >
                <Sparkles size={iconSize} color="white" />
              </Box>
            </Box>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' } }}
            >
              AI Помощник
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
            >
              Поговори с мен за каквото те вълнува
            </Typography>
          </Box>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: { xs: 3, md: 4 },
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'divider',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Messages Area */}
            <Box
              sx={{
                height: chatHeight,
                overflowY: 'auto',
                p: { xs: 2, sm: 3, md: 4 },
                bgcolor: '#fafafa',
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(102, 126, 234, 0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#d1d5db',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9ca3af',
                  },
                },
              }}
            >
              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <Box key={i} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                      <Skeleton 
                        variant="circular" 
                        width={isMobile ? 40 : 48} 
                        height={isMobile ? 40 : 48} 
                        sx={{ mr: 2 }} 
                      />
                      <Skeleton 
                        variant="rectangular" 
                        width={isMobile ? '70%' : '60%'} 
                        height={isMobile ? 60 : 80} 
                        sx={{ borderRadius: 3 }} 
                      />
                    </Box>
                  ))}
                </>
              ) : (
                <AnimatePresence>
                  {messages.map((msg) => (
                    <Message
                      key={msg._id || msg.id}
                      message={msg.message || msg.text}
                      isAi={msg.isAi}
                      isMobile={isMobile}
                    />
                  ))}
                </AnimatePresence>
              )}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                      }}
                    >
                      <Bot size={isMobile ? 20 : 24} />
                    </Avatar>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 3,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                            style={{ 
                              width: isMobile ? 6 : 8, 
                              height: isMobile ? 6 : 8, 
                              borderRadius: '50%', 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                bgcolor: 'white',
                borderTop: '2px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={isMobile ? 3 : 4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напиши съобщение..."
                  inputRef={inputRef}
                  disabled={sending}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: '#fafafa',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { 
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
                
                <motion.div 
                  whileHover={{ scale: isMobile ? 1 : 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleSend}
                    disabled={sending || !(message && message.trim())}
                    sx={{
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #63407d 100%)',
                        boxShadow: '0 6px 24px rgba(102, 126, 234, 0.5)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  >
                    {sending ? (
                      <CircularProgress size={isMobile ? 20 : 24} sx={{ color: 'white' }} />
                    ) : (
                      <Send size={isMobile ? 18 : 24} />
                    )}
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}