import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Всички полета са задължителни." });
  }

  try {
    const newUser = await User.create({ username, email, password });
    res.json({ message: "Успешна регистрация." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {console.log("LOGIN BODY:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER FROM DB:", user);
console.log("RAW PASSWORD IN DB:", user.password);
console.log("COMPARE:", await user.comparePassword(password));

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Грешен имейл или парола." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Успешен вход.",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Грешка при вход." });
  }
});

// ТОВА ЛИПСВА ПРИ ТЕБ:
export default router;
