// src/components/CrisisResources.jsx - Fully Responsive
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Container
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Phone,
  Globe,
  AlertCircle,
  Heart,
  ExternalLink,
  MessageCircle
} from "lucide-react";

export default function CrisisResources() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const bgResources = [
    {
      title: "Спешна помощ – 112",
      desc: "За ситуации, изискващи незабавна намеса.",
      type: "24/7",
      icon: AlertCircle,
      color: "#ef4444",
      phone: "112"
    },
    {
      title: "Национална линия за деца – 116 111",
      desc: "Безплатен и анонимен телефон за деца и младежи.",
      type: "24/7",
      icon: Phone,
      color: "#3b82f6",
      phone: "116111"
    },
    {
      title: "Национална линия за психично здраве – 0800 10 110",
      desc: "Подкрепа при тревожност, депресия и емоционални кризи.",
      type: "24/7",
      icon: Heart,
      color: "#a855f7",
      phone: "080010110"
    },
    {
      title: "Линия за домашно насилие – 0800 18 676",
      desc: "Конфиденциална помощ и консултации.",
      type: "24/7",
      icon: Phone,
      color: "#ec4899",
      phone: "080018676"
    }
  ];

  const intlResources = [
    {
      title: "988 Suicide & Crisis Lifeline (USA)",
      desc: "Подкрепа при самоубийствени мисли и емоционална криза.",
      icon: Globe,
      url: "https://988lifeline.org"
    },
    {
      title: "Samaritans (UK)",
      desc: "24/7 емоционална подкрепа.",
      icon: MessageCircle,
      url: "https://www.samaritans.org"
    },
    {
      title: "International Suicide Hotlines",
      desc: "Глобален списък с линии за помощ по държави.",
      icon: ExternalLink,
      url: "https://www.opencounseling.com/suicide-hotlines"
    }
  ];

  const card = (item) => (
    <motion.div 
      whileHover={{ scale: isMobile ? 1 : 1.02 }} 
      style={{ width: "100%" }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, md: 3 },
          borderRadius: { xs: 3, md: 4 },
          background: "linear-gradient(135deg, #ffffff 0%, #f4f4ff 100%)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)"
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 2, sm: 3 }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box
            sx={{
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              minWidth: { xs: 50, md: 60 },
              borderRadius: "50%",
              background: `${item.color || "#6b7280"}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: { xs: 'auto', sm: 0 }
            }}
          >
            <item.icon size={isMobile ? 28 : 32} color={item.color || "#6b7280"} />
          </Box>

          <Box flex={1} width="100%">
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {item.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8, 
                mt: 0.5,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {item.desc}
            </Typography>
            {item.type && (
              <Chip
                label={item.type}
                size="small"
                sx={{
                  mt: 1.5,
                  background: `${item.color}20`,
                  color: item.color,
                  fontWeight: 600,
                  display: { xs: 'inline-flex', sm: 'inline-flex' },
                  mx: { xs: 'auto', sm: 0 }
                }}
              />
            )}
          </Box>
        </Stack>

        <Box sx={{ mt: 2 }}>
          {item.phone ? (
            <Button
              variant="contained"
              fullWidth
              href={`tel:${item.phone}`}
              sx={{
                py: { xs: 1, sm: 1.3 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${item.color} 0%, #00000040 120%)`,
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '0.95rem' }
              }}
            >
              Обади се
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              href={item.url}
              target="_blank"
              sx={{
                py: { xs: 1, sm: 1.3 },
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '0.95rem' }
              }}
            >
              Посети сайта
            </Button>
          )}
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        maxWidth: "1100px", 
        mx: "auto" 
      }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: { xs: 3, md: 4 }, 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          🆘 Кризисни ресурси и помощ
        </Typography>

        {/* България */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          🇧🇬 Български ресурси
        </Typography>

        {bgResources.map((item, i) => (
          <React.Fragment key={i}>{card(item)}</React.Fragment>
        ))}

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        {/* International */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          🌍 Международни ресурси
        </Typography>

        {intlResources.map((item, i) => (
          <React.Fragment key={i}>{card(item)}</React.Fragment>
        ))}
      </Box>
    </Container>
  );
}