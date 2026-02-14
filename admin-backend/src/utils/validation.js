// backend/src/utils/validation.js
export const validateEmotion = (req, res, next) => {
  const { mood, energy, note } = req.body;
  
  if (!mood || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'Invalid mood value (1-5)' });
  }
  
  if (!energy || energy < 1 || energy > 5) {
    return res.status(400).json({ error: 'Invalid energy value (1-5)' });
  }
  
  if (note && note.length > 500) {
    return res.status(400).json({ error: 'Note too long (max 500 chars)' });
  }
  
  next();
};