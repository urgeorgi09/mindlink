import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// POST /api/chat/ai - AI Chat с OpenRouter
export const getAiResponse = async (req, res) => {
  const userId = req.header('X-User-Id') || req.ip;
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Ти си MindLink — AI терапевт, който говори само на български. Бъди кратък, човешки и емпатичен.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let aiReply =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.generated_text ||
      '🤖 Няма отговор.';

    aiReply = aiReply.replace(/<s>|<\/s>/g, '').trim();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error('❌ AI Error:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'AI error', 
      details: err.response?.data || err.message 
    });
  }
};