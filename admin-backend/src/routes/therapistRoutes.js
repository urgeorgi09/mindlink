// backend/src/routes/therapistRoutes.js
import express from "express";
import { getTherapists, createTherapist } from "../controllers/therapistController.js";

const router = express.Router();

router.get("/", getTherapists);
router.post("/", createTherapist);

export default router;
