import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7c7cff 0%, #ff7a7a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1,
              }}
            >
              404
            </Typography>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="h4" fontWeight={700}>
              Page Not Found
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '1rem',
                maxWidth: 400,
                lineHeight: 1.5,
                px: 2,
              }}
            >
              The page you're looking for doesn't exist or has been moved.
            </Typography>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                component={NavLink}
                to="/"
                sx={{
                  background: 'linear-gradient(135deg, #7c7cff 0%, #5a5aff 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6b6bff 0%, #4949ff 100%)',
                  },
                  px: 4,
                }}
              >
                Go to Homepage
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={NavLink}
                to="/subscriptions"
                sx={{
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(124,124,255,0.08)',
                  },
                  px: 4,
                }}
              >
                View Plans
              </Button>
            </Stack>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box
              sx={{
                width: 60,
                height: 4,
                background: 'linear-gradient(90deg, #7c7cff, #ff7a7a)',
                borderRadius: 2,
                mt: 2,
              }}
            />
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}