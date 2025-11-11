import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Container, Avatar, IconButton, Alert, CircularProgress } from '@mui/material';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatMessages, sendChatMessage } from '../api';

// Helper to call backend Hugging Face endpoint
async function fetchAiReply(message) {
  const response = await fetch('http://localhost:5000/api/hf-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const result = await response.json();
  if (result.reply) return result.reply;
  throw new Error(result.error || 'AI reply error');
}

const Message = ({ message, isAi }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isAi ? 'flex-start' : 'flex-end',
          mb: 2,
        }}
      >
        {isAi && (
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 1,
              width: 40,
              height: 40,
            }}
          >
            <Bot size={24} />
          </Avatar>
        )}
        <Paper
          elevation={0}
          sx={{
            maxWidth: '70%',
            p: 2,
            borderRadius: 3,
            bgcolor: isAi ? 'background.paper' : 'primary.main',
            color: isAi ? 'text.primary' : 'white',
            boxShadow: isAi 
              ? '0 2px 12px rgba(0, 0, 0, 0.05)' 
              : '0 2px 12px rgba(99, 102, 241, 0.2)',
            border: isAi ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <Typography variant="body1">{message}</Typography>
        </Paper>
        {!isAi && (
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              ml: 1,
              width: 40,
              height: 40,
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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // TODO: Replace with actual user ID after adding authentication
  const userId = 'temp-user-id';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getChatMessages(userId);
        if (response.data.length === 0) {
          // If no messages, add welcome message
          const welcomeMessage = {
            userId,
            message: 'Здравей! Аз съм твоят AI помощник. Как мога да ти помогна днес?',
            isAi: true
          };
          const welcomeResponse = await sendChatMessage(welcomeMessage);
          setMessages([welcomeResponse.data]);
        } else {
          setMessages(response.data);
        }
      } catch (err) {
        setError('Грешка при зареждане на съобщенията. Моля, опитайте отново.');
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      setError('');

      // Send user message
      const userMessage = {
        userId,
        message: newMessage,
        isAi: false
      };
      const userResponse = await sendChatMessage(userMessage);
      setMessages(prev => [...prev, userResponse.data]);

      const messageText = newMessage;
      setNewMessage('');

      // Get AI reply from backend
      let aiReply = '';
      try {
        aiReply = await fetchAiReply(messageText);
      } catch (err) {
        aiReply = 'Грешка при получаване на AI отговор.';
      }

      // Save AI reply in chat history
      const aiMessage = {
        userId,
        message: aiReply,
        isAi: true
      };
      const aiResponse = await sendChatMessage(aiMessage);
      setMessages(prev => [...prev, aiResponse.data]);
    } catch (err) {
      setError('Грешка при изпращане на съобщението. Моля, опитайте отново.');
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            align="center" 
            fontWeight="600"
            sx={{ mb: 4 }}
          >
            AI Помощник
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mt: 2,
              borderRadius: 4,
              bgcolor: '#f8fafc',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              minHeight: '400px',
              maxHeight: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box 
              sx={{ 
                flexGrow: 1,
                mb: 2, 
                overflowY: 'auto',
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c7c7c7',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#a8a8a8',
                  },
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <Message 
                      key={message._id || message.id} 
                      message={message.message || message.text} 
                      isAi={message.isAi} 
                    />
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2,
                p: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напиши съобщение..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'white',
                    '&:hover': {
                      '& > fieldset': { borderColor: 'primary.main' }
                    }
                  }
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  onClick={handleSend}
                  disabled={isSending}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      color: 'action.disabled'
                    }
                  }}
                >
                  {isSending ? <CircularProgress size={24} color="inherit" /> : <Send />}
                </IconButton>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}