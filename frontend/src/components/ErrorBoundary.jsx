// src/components/ErrorBoundary.jsx - Fully Responsive
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ React ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 500,
              width: "100%",
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: "center",
              borderRadius: { xs: 3, md: 4 },
              border: "2px solid",
              borderColor: "error.light",
            }}
          >
            <Box
              sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                borderRadius: "50%",
                bgcolor: "error.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: { xs: 2, md: 3 },
              }}
            >
              <AlertTriangle size={window.innerWidth < 600 ? 32 : 40} color="white" />
            </Box>

            <Typography
              variant="h4"
              fontWeight="700"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
            >
              Нещо се обърка
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: { xs: 3, md: 4 },
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
              }}
            >
              Възникна неочаквана грешка. Моля, презаредете страницата.
            </Typography>

            <Button
              variant="contained"
              size={window.innerWidth < 600 ? "medium" : "large"}
              fullWidth={window.innerWidth < 600}
              startIcon={<RefreshCw size={window.innerWidth < 600 ? 18 : 20} />}
              onClick={this.handleReload}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                py: { xs: 1.25, md: 1.5 },
                fontSize: { xs: "0.95rem", md: "1rem" },
              }}
            >
              Презареди страницата
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
