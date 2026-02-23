import {
  Box,
  Stack,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import NavLayout from "../layout/navlayout";
import HeroBanner from "../assets/homebanner.jpg";

import recordRecitation from "../assets/voiceover.png";
import trackProgress from "../assets/trackprogress.png";
import aiErrorDetection from "../assets/aierrordetection.jpg";

import Reviews from "../components/UserResponse/reviews";
import Feedback from "../components/UserResponse/feedback";

/* ---------- VH CONTROLLED IMAGE (DO NOT TOUCH SIZE) ---------- */
const FeatureImage = ({ src, alt }) => (
  <Box
    sx={{
      width: "100%",
      height: {
        xs: "46vh",
        sm: "50vh",
        md: "54vh",
      },
      borderRadius: 3,
      overflow: "hidden",
      backgroundColor: "rgba(0,0,0,0.35)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </Box>
);

/* ---------- SIMPLE ANIMATION COMPONENT ---------- */
const ScrollAnimation = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const sectionRef = useRef(null);

  return (
    <NavLayout>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${HeroBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography variant="h2" fontWeight={700}>
                Perfect Your Quran Recitation with AI Precision
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ maxWidth: 720, fontSize: "1.05rem" }}
              >
                Identify mistakes, refine pronunciation, and follow a structured
                learning path guided by intelligent feedback designed for every
                reciter.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={NavLink}
                  to="/aboutus"
                >
                  Our Story
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={NavLink}
                  to="/login"
                >
                  Join Us
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ================= STATS ================= */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              ["25K+", "Active Users"],
              ["120+", "Supported Reciters"],
              ["300K+", "Monthly Evaluations"],
            ].map(([value, label], i) => (
              <Grid key={i} item size={{xs:12, md:3}}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "rgba(22,22,26,0.5)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                      },
                    }}
                  >
                    <Typography variant="h3" color="primary" fontWeight={700}>
                      {value}
                    </Typography>
                    <Typography color="text.secondary">{label}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= WHAT WE OFFER ================= */}
      <Box 
        sx={{ 
          backgroundColor: "background.paper", 
          py: 8,
        }}
        ref={sectionRef}
      >
        <Container maxWidth="lg">
          <Stack spacing={8}>
            {/* HEADER */}
            <ScrollAnimation>
              <Stack textAlign="center" spacing={1}>
                <Typography variant="h3" fontWeight={700}>
                  What We Offer
                </Typography>
                <Typography color="text.secondary" sx={{ mx: "auto" }}>
                  A complete intelligent system crafted to elevate your recitation journey.
                </Typography>
              </Stack>
            </ScrollAnimation>

            {/* FEATURE 1: Record Recitation */}
            <ScrollAnimation delay={0.1}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 3,
                  border: "1px solid rgba(124,124,255,0.1)",
                  backgroundColor: "rgba(22,22,26,0.6)",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Grid container spacing={6} alignItems="center">
                  <Grid item size={{xs:12, md:6}}>
                    <Stack spacing={3}>
                      <Typography variant="h4" fontWeight={600}>
                        Record Your Recitation
                      </Typography>
                      <Box sx={{ width: 60, height: 3, backgroundColor: "primary.main", borderRadius: 2 }} />
                      <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
                        Easily upload or record your Quran recitation directly through
                        our platform with a smooth and distraction-free experience.
                        Supports multiple audio formats and provides clear recording
                        quality for accurate analysis.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item size={{xs:12, md:6}}>
                    <FeatureImage src={recordRecitation} alt="Record Recitation" />
                  </Grid>
                </Grid>
              </Paper>
            </ScrollAnimation>

            {/* FEATURE 2: AI Error Detection */}
            <ScrollAnimation delay={0.2}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 3,
                  border: "1px solid rgba(255,122,122,0.1)",
                  backgroundColor: "rgba(26,22,22,0.6)",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                <Grid container spacing={6} alignItems="center">
                  <Grid item size={{xs:12, md:6}} order={{ xs: 2, md: 1 }}>
                    <FeatureImage src={aiErrorDetection} alt="AI Error Detection" />
                  </Grid>
                  <Grid item size={{xs:12, md:6}} order={{ xs: 1, md: 2 }}>
                    <Stack spacing={3}>
                      <Typography variant="h4" fontWeight={600}>
                        AI-Based Error Detection
                      </Typography>
                      <Box sx={{ width: 60, height: 3, backgroundColor: "secondary.main", borderRadius: 2 }} />
                      <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
                        Our AI analyzes pronunciation, tajweed rules, and fluency
                        to detect mistakes with precision and clarity. Get detailed
                        feedback on common errors and learn how to correct them
                        effectively.
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </ScrollAnimation>

            {/* FEATURE 3: Track Progress */}
            <ScrollAnimation delay={0.3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 3,
                  border: "1px solid rgba(124,124,255,0.1)",
                  backgroundColor: "rgba(22,22,26,0.6)",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Grid container spacing={6} alignItems="center">
                  <Grid item size={{xs:12, md:6}}>
                    <Stack spacing={3}>
                      <Typography variant="h4" fontWeight={600}>
                        Track Your Progress
                      </Typography>
                      <Box sx={{ width: 60, height: 3, backgroundColor: "primary.main", borderRadius: 2 }} />
                      <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
                        Monitor improvements over time with structured feedback,
                        performance insights, and guided recommendations. Visualize
                        your growth through comprehensive analytics and progress
                        reports.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item size={{xs:12, md:6}}>
                    <FeatureImage src={trackProgress} alt="Track Progress" />
                  </Grid>
                </Grid>
              </Paper>
            </ScrollAnimation>
          </Stack>
        </Container>
      </Box>

      {/* ================= CTA SECTION ================= */}
      <ScrollAnimation delay={0.4}>
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Typography variant="h4" fontWeight={700}>
                  Start Your Recitation Journey Today
                </Typography>
                <Box 
                  sx={{ 
                    position: "absolute", 
                    bottom: -8, 
                    left: 0, 
                    width: "100%", 
                    height: "3px", 
                    backgroundColor: "primary.main",
                    borderRadius: 2,
                  }} 
                />
              </Box>
              <Typography color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6, fontSize: "1.05rem" }}>
                Join thousands of learners who have transformed their Quran recitation 
                with our AI-powered platform. Begin with a free trial and experience 
                the difference intelligent feedback can make.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={NavLink}
                to="/subscription"
                sx={{ px: 6, py: 1.5, mt: 2 }}
              >
                View Subscription Plans
              </Button>
            </Stack>
          </Container>
        </Box>
      </ScrollAnimation>
      
      <Reviews />
      <Feedback />
    </NavLayout>
  );
}