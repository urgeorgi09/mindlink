import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, IconButton, 
  Container, Avatar, CircularProgress, Skeleton 
} from '@mui/material';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';

const Message = ({ message, isAi }) => {
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
          mb: 3,
        }}
      >
        {isAi && (
          <Avatar
            sx={{
              bgcolor: 'transparent',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: 2,
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Bot size={24} />
          </Avatar>
        )}
        
        <Paper
          elevation={0}
          sx={{
            maxWidth: '75%',
            p: 2.5,
            borderRadius: 3,
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
            '&::before': isAi ? {
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
              wordBreak: 'break-word'
            }}
          >
            {message}
          </Typography>
        </Paper>

        {!isAi && (
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              ml: 2,
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
            }}
          >
            <User size={24} />
          </Avatar>
        )}
      </Box>
    </motion.div>
  );
};

export default function AiChat() {
  const { messages, loading, sending, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage;
    setNewMessage('');
    
    await sendMessage(messageText);
    
    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
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
                <Sparkles size={40} color="white" />
              </Box>
            </Box>
            <Typography variant="h3" fontWeight="700" gutterBottom>
              AI Помощник
            </Typography>
            <Typography variant="h6" color="text.secondary">
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
              borderRadius: 4,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'divider',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Messages Area */}
            <Box
              sx={{
                height: '600px',
                overflowY: 'auto',
                p: 4,
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
                      <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                      <Skeleton variant="rectangular" width="60%" height={80} sx={{ borderRadius: 3 }} />
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
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Bot size={24} />
                    </Avatar>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          }}
                        />
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
                p: 3,
                bgcolor: 'white',
                borderTop: '2px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напиши съобщение..."
                  inputRef={inputRef}
                  disabled={sending}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: '#fafafa',
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
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleSend}
                    disabled={sending || !newMessage.trim()}
                    sx={{
                      width: 64,
                      height: 64,
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
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      <Send />
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