// backend/src/routes/breathingRoutes.js
import express from "express";
const router = express.Router();

/**
 * Simple breathing modes - can be extended to use a DB collection (modes)
 * GET /api/breathing
 */
router.get("/", (req, res) => {
  const modes = [
    {
      id: "box",
      name: "Box breathing",
      steps: [
        { text: "Inhale", duration: 4 },
        { text: "Hold", duration: 4 },
        { text: "Exhale", duration: 4 },
        { text: "Hold", duration: 4 }
      ]
    },
    {
      id: "relax-4-6",
      name: "Relax 4-6",
      steps: [
        { text: "Inhale", duration: 4 },
        { text: "Exhale slowly", duration: 6 }
      ]
    },
    {
      id: "calm-3-3-6",
      name: "Calm 3-3-6",
      steps: [
        { text: "Inhale", duration: 3 },
        { text: "Hold", duration: 3 },
        { text: "Exhale", duration: 6 }
      ]
    }
  ];

  res.json(modes);
});

export default router;
