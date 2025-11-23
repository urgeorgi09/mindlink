// src/pages/Chat.jsx - Responsive Wrapper
import React from "react";
import { Box } from "@mui/material";
import AIChat from "../components/AIChat";

export default function Chat() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      }}
    >
      <AIChat />
    </Box>
  );
}