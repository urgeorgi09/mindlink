// backend/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Unexpected server error."
  });
};
