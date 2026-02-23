import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import NavLayout from "../layout/navlayout";

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Subscriptions() {
  return (
    <NavLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* PAGE HEADER */}
          <Stack spacing={1.5} sx={{ mb: 6 }}>
            <Typography variant="h2" textAlign={"center"}>
              Subscriptions
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", px: 6 }}
              textAlign={"center"}
            >
              Choose a plan that fits your learning journey. Each subscription
              provides credits that can be used to evaluate Quran recitation and
              receive detailed feedback.
            </Typography>
          </Stack>

          {/* SUBSCRIPTION CARDS */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* Free Tier */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                component={motion.div}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h3">Free</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Includes a limited number of credits for basic recitation
                    evaluation and platform exploration.
                  </Typography>
                  <Box>
                    <Typography variant="body2">
                      • Credits: 10 / month
                    </Typography>
                    <Typography variant="body2">
                      • Basic accuracy feedback
                    </Typography>
                    <Typography variant="body2">
                      • Limited history access
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Best for beginners exploring the platform.
                  </Typography>
                  <Button variant="outlined" disabled>
                    Current Plan
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Student Tier */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                component={motion.div}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid rgba(124,124,255,0.5)",
                  backgroundColor: "rgba(124,124,255,0.04)",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h3">Student</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Designed for students who want consistent practice and
                    deeper insight into their recitation.
                  </Typography>
                  <Box>
                    <Typography variant="body2">
                      • Credits: 100 / month
                    </Typography>
                    <Typography variant="body2">
                      • Detailed pronunciation analysis
                    </Typography>
                    <Typography variant="body2">
                      • Practice history & progress tracking
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Best for students actively learning Tajweed.
                  </Typography>
                  <Button variant="contained">Choose Student</Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Qari Tier */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                component={motion.div}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h3">Qari</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Advanced tier intended for serious reciters and teachers who
                    require high usage limits and detailed evaluation.
                  </Typography>
                  <Box>
                    <Typography variant="body2">
                      • Credits: 500 / month
                    </Typography>
                    <Typography variant="body2">
                      • Advanced phoneme-level feedback
                    </Typography>
                    <Typography variant="body2">
                      • Priority processing
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Best for professional reciters.
                  </Typography>
                  <Button variant="outlined">Choose Qari</Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* BENEFITS / BLOG SECTION */}
          <Stack spacing={4}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Why Choose a Subscription?
            </Typography>

            <Grid container spacing={4}>
              {/* Intro / Value Statement */}
              <Grid item size={12}>
                <Paper
                  component={motion.div}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{ p: 3, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    A Smarter Way to Improve Your Recitation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learning Quran recitation requires consistency, accurate
                    feedback, and exposure to authentic standards. Qiraa’H
                    subscriptions are designed to support serious learners by
                    combining trusted recitation references with advanced AI
                    analysis. Instead of guessing mistakes, you receive clear,
                    structured feedback that helps you improve with confidence.
                  </Typography>
                </Paper>
              </Grid>

              {/* Benefit 1 */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Paper
                  component={motion.div}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{ p: 3, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    Track Your Progress Over Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Every evaluation is saved to your history, allowing you to
                    monitor improvement across sessions. You can clearly see
                    which areas have improved and which require more focus,
                    turning practice into a measurable learning journey.
                  </Typography>
                </Paper>
              </Grid>

              {/* Benefit 2 */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Paper
                  component={motion.div}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{ p: 3, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    Learn from Authentic Recitation Styles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Higher subscription tiers unlock access to additional
                    verified reciters, including both male and female voices.
                    This exposure helps learners understand variation in tone,
                    pace, and articulation while maintaining strict Tajweed
                    accuracy.
                  </Typography>
                </Paper>
              </Grid>

              {/* Benefit 3 */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Paper
                  component={motion.div}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{ p: 3, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    Faster & Deeper AI Evaluation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subscribed users benefit from higher processing priority and
                    more detailed analysis. Advanced tiers receive phoneme-level
                    feedback and clearer corrective audio, helping you fix
                    mistakes immediately and practice with precision.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </NavLayout>
  );
}
