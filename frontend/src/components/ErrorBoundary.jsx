import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ React ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 500,
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'error.light',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <AlertTriangle size={40} color="white" />
            </Box>

            <Typography variant="h4" fontWeight="700" gutterBottom>
              Нещо се обърка
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Възникна неочаквана грешка. Моля, презаредете страницата.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshCw />}
              onClick={this.handleReload}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
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