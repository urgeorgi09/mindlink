// Почистване на записи, по-стари от 1 час, на всеки 15 минути
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [userId, lastSeen] of onlineUsers.entries()) {
    if (lastSeen < oneHourAgo) {
      onlineUsers.delete(userId);
    }
  }
}, 15 * 60 * 1000);