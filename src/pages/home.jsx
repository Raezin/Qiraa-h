// ============================================================
// src/pages/home.jsx — RESTYLED (Light Mode, Green Accent)
// Qolb-inspired: clean, full-screen, elegant Islamic feel
// Firebase auth & existing components untouched
// ============================================================

import {
  Box, Stack, Typography, Button, Container,
  Grid, Paper, Avatar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import NavLayout from "../layout/navlayout";
import HeroBanner    from "../assets/homebanner.jpg";
import recordRecitation from "../assets/voiceover.png";
import trackProgress    from "../assets/trackprogress.png";
import aiErrorDetection from "../assets/aierrordetection.jpg";
import Reviews  from "../components/UserResponse/reviews";
import Feedback from "../components/UserResponse/feedback";

/* ─── design tokens (light mode) ─────────────────────────── */
const G = {
  green:      "#2d6a4f",
  greenLight: "#52b788",
  greenPale:  "#d8f3dc",
  greenBg:    "#f0faf4",
  sand:       "#fefae0",
  text:       "#1b1b1b",
  muted:      "#6b7280",
  white:      "#ffffff",
  border:     "#e5e7eb",
};

/* ─── scroll-reveal wrapper ──────────────────────────────── */
const Reveal = ({ children, delay = 0, y = 28 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── feature image (VH controlled — DO NOT TOUCH SIZE) ─── */
const FeatureImage = ({ src, alt }) => (
  <Box sx={{
    width: "100%",
    height: { xs: "46vh", sm: "50vh", md: "54vh" },
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(45,106,79,0.12)",
    border: `1px solid ${G.greenPale}`,
  }}>
    <Box component="img" src={src} alt={alt}
      sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Box>
);

/* ─── arabic-style section divider ──────────────────────── */
const Divider = () => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 1 }}>
    <Box sx={{ width: 40, height: 1, bgcolor: G.greenLight, opacity: 0.4 }} />
    <Box sx={{
      mx: 1.5, width: 8, height: 8, borderRadius: "50%",
      bgcolor: G.greenLight,
    }} />
    <Box sx={{ width: 40, height: 1, bgcolor: G.greenLight, opacity: 0.4 }} />
  </Box>
);

export default function Home() {
  return (
    <NavLayout>

      {/* ══════════════════════════════════════════
          HERO — full-viewport, image left + text right
      ══════════════════════════════════════════ */}
      <Box sx={{
        minHeight: "92vh",
        backgroundColor: G.white,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* background pattern */}
        <Box sx={{
          position: "absolute", inset: 0, opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d6a4f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* soft green orb */}
        <Box sx={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "55vw", height: "55vw", borderRadius: "50%",
          background: `radial-gradient(circle, ${G.greenPale} 0%, transparent 70%)`,
          opacity: 0.6,
        }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">

            {/* LEFT — hero image */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box sx={{
                  borderRadius: 5, overflow: "hidden",
                  boxShadow: `0 32px 80px rgba(45,106,79,0.18)`,
                  border: `1px solid ${G.greenPale}`,
                  aspectRatio: "4/3",
                }}>
                  <Box component="img" src={HeroBanner} alt="Quran recitation"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              </motion.div>
            </Grid>

            {/* RIGHT — text */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Stack spacing={3.5}>
                  {/* badge */}
                  <Box sx={{
                    display: "inline-flex", alignItems: "center",
                    gap: 1, alignSelf: "flex-start",
                    px: 2, py: 0.75, borderRadius: 20,
                    backgroundColor: G.greenPale,
                    border: `1px solid ${G.greenLight}40`,
                  }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: G.green }} />
                    <Typography variant="caption" sx={{ color: G.green, fontWeight: 700, letterSpacing: 0.5 }}>
                      AI-Powered Quran Learning
                    </Typography>
                  </Box>

                  <Typography variant="h2" fontWeight={800} sx={{
                    color: G.text, lineHeight: 1.1,
                    fontSize: { xs: "2.2rem", md: "3rem", lg: "3.5rem" },
                    fontFamily: "'Georgia', serif",
                  }}>
                    Perfect Your{" "}
                    <Box component="span" sx={{ color: G.green }}>Quran</Box>{" "}
                    Recitation with Precision
                  </Typography>

                  <Typography sx={{ color: G.muted, fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 460 }}>
                    Identify tajweed mistakes, refine your pronunciation, and follow a
                    structured learning path guided by intelligent AI feedback — designed
                    for every level of reciter.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={1}>
                    <Button
                      component={NavLink} to="/login"
                      variant="contained" size="large"
                      sx={{
                        bgcolor: G.green, color: "#fff",
                        px: 4, py: 1.5, borderRadius: 2.5,
                        fontWeight: 700, fontSize: "0.95rem",
                        boxShadow: `0 8px 24px ${G.green}40`,
                        "&:hover": { bgcolor: G.greenLight, boxShadow: `0 12px 32px ${G.green}50` },
                        transition: "all 0.25s",
                      }}
                    >
                      Start Learning Free
                    </Button>
                    <Button
                      component={NavLink} to="/aboutus"
                      variant="outlined" size="large"
                      sx={{
                        borderColor: G.green, color: G.green,
                        px: 4, py: 1.5, borderRadius: 2.5,
                        fontWeight: 600,
                        "&:hover": { bgcolor: G.greenPale, borderColor: G.green },
                      }}
                    >
                      Our Story
                    </Button>
                  </Stack>

                  {/* social proof */}
                  <Stack direction="row" alignItems="center" spacing={1.5} pt={1}>
                    <Stack direction="row">
                      {["A","B","C","D"].map((l, i) => (
                        <Avatar key={l} sx={{
                          width: 32, height: 32, fontSize: "0.75rem",
                          bgcolor: [G.green, G.greenLight, "#74c69d", "#95d5b2"][i],
                          ml: i === 0 ? 0 : -1,
                          border: `2px solid ${G.white}`,
                        }}>{l}</Avatar>
                      ))}
                    </Stack>
                    <Typography variant="body2" sx={{ color: G.muted }}>
                      <Box component="span" sx={{ color: G.green, fontWeight: 700 }}>25,000+</Box> reciters improving daily
                    </Typography>
                  </Stack>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: G.green, py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[
              { value: "25K+",   label: "Active Reciters" },
              { value: "120+",   label: "Supported Reciters" },
              { value: "300K+",  label: "Monthly Evaluations" },
              { value: "98%",    label: "Accuracy Rate" },
            ].map(({ value, label }, i) => (
              <Grid key={i} item xs={6} md={3}>
                <Reveal delay={i * 0.08}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: G.white }}>
                      {value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {label}
                    </Typography>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          WHAT WE OFFER
      ══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: G.white, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Reveal>
            <Stack alignItems="center" spacing={1.5} sx={{ mb: 10, textAlign: "center" }}>
              <Typography variant="overline" sx={{ color: G.green, fontWeight: 700, letterSpacing: 2 }}>
                Features
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ color: G.text, fontFamily: "'Georgia', serif" }}>
                Let's Start the Journey of Enlightenment
              </Typography>
              <Divider />
              <Typography sx={{ color: G.muted, maxWidth: 560, lineHeight: 1.75 }}>
                A complete intelligent system crafted to elevate your recitation journey — from recording to detailed tajweed analysis.
              </Typography>
            </Stack>
          </Reveal>

          <Stack spacing={6}>
            {/* Feature 1 */}
            <Reveal delay={0.05}>
              <Paper elevation={0} sx={{
                borderRadius: 5, overflow: "hidden",
                border: `1px solid ${G.border}`,
                bgcolor: G.greenBg,
              }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 6 } }}>
                    <Stack spacing={2.5}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        bgcolor: G.greenPale, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Typography fontSize="1.5rem">🎙️</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={700} sx={{ color: G.text, fontFamily: "'Georgia', serif" }}>
                        Record Your Recitation
                      </Typography>
                      <Box sx={{ width: 48, height: 3, bgcolor: G.green, borderRadius: 2 }} />
                      <Typography sx={{ color: G.muted, lineHeight: 1.8, fontSize: "1.02rem" }}>
                        Easily upload or record your Quran recitation directly through our platform.
                        Supports multiple audio formats and provides crystal-clear recording quality
                        for accurate AI analysis.
                      </Typography>
                      <Button component={NavLink} to="/login"
                        variant="contained" sx={{
                          alignSelf: "flex-start", bgcolor: G.green, color: "#fff",
                          px: 3, borderRadius: 2, fontWeight: 600,
                          "&:hover": { bgcolor: G.greenLight },
                        }}>
                        Try Recording →
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 4 } }}>
                    <FeatureImage src={recordRecitation} alt="Record Recitation" />
                  </Grid>
                </Grid>
              </Paper>
            </Reveal>

            {/* Feature 2 */}
            <Reveal delay={0.1}>
              <Paper elevation={0} sx={{
                borderRadius: 5, overflow: "hidden",
                border: `1px solid ${G.border}`,
                bgcolor: G.white,
              }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }} sx={{ p: { xs: 3, md: 4 } }}>
                    <FeatureImage src={aiErrorDetection} alt="AI Error Detection" />
                  </Grid>
                  <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} sx={{ p: { xs: 4, md: 6 } }}>
                    <Stack spacing={2.5}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        bgcolor: G.greenPale, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Typography fontSize="1.5rem">🤖</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={700} sx={{ color: G.text, fontFamily: "'Georgia', serif" }}>
                        AI-Based Error Detection
                      </Typography>
                      <Box sx={{ width: 48, height: 3, bgcolor: G.green, borderRadius: 2 }} />
                      <Typography sx={{ color: G.muted, lineHeight: 1.8, fontSize: "1.02rem" }}>
                        Our AI analyzes pronunciation, tajweed rules, and fluency to detect mistakes
                        with precision. Get detailed feedback on common errors and learn how to
                        correct them effectively.
                      </Typography>
                      <Button component={NavLink} to="/login"
                        variant="contained" sx={{
                          alignSelf: "flex-start", bgcolor: G.green, color: "#fff",
                          px: 3, borderRadius: 2, fontWeight: 600,
                          "&:hover": { bgcolor: G.greenLight },
                        }}>
                        See How It Works →
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Reveal>

            {/* Feature 3 */}
            <Reveal delay={0.15}>
              <Paper elevation={0} sx={{
                borderRadius: 5, overflow: "hidden",
                border: `1px solid ${G.border}`,
                bgcolor: G.greenBg,
              }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 6 } }}>
                    <Stack spacing={2.5}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        bgcolor: G.greenPale, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Typography fontSize="1.5rem">📈</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={700} sx={{ color: G.text, fontFamily: "'Georgia', serif" }}>
                        Track Your Progress
                      </Typography>
                      <Box sx={{ width: 48, height: 3, bgcolor: G.green, borderRadius: 2 }} />
                      <Typography sx={{ color: G.muted, lineHeight: 1.8, fontSize: "1.02rem" }}>
                        Monitor improvements over time with structured feedback, performance
                        insights, and guided recommendations. Visualize your growth through
                        comprehensive analytics and progress reports.
                      </Typography>
                      <Button component={NavLink} to="/login"
                        variant="contained" sx={{
                          alignSelf: "flex-start", bgcolor: G.green, color: "#fff",
                          px: 3, borderRadius: 2, fontWeight: 600,
                          "&:hover": { bgcolor: G.greenLight },
                        }}>
                        View Dashboard →
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 4 } }}>
                    <FeatureImage src={trackProgress} alt="Track Progress" />
                  </Grid>
                </Grid>
              </Paper>
            </Reveal>
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════ */}
      <Box sx={{
        py: { xs: 10, md: 16 },
        background: `linear-gradient(135deg, ${G.green} 0%, ${G.greenLight} 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        {[
          { size: 300, top: "-30%", left: "-10%", opacity: 0.08 },
          { size: 200, bottom: "-20%", right: "-5%", opacity: 0.1 },
        ].map((c, i) => (
          <Box key={i} sx={{
            position: "absolute",
            width: c.size, height: c.size,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            top: c.top, left: c.left,
            bottom: c.bottom, right: c.right,
            opacity: c.opacity,
          }} />
        ))}

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <Stack alignItems="center" textAlign="center" spacing={3}>
              <Typography variant="h3" fontWeight={800} sx={{
                color: G.white, fontFamily: "'Georgia', serif",
                fontSize: { xs: "2rem", md: "2.8rem" },
              }}>
                Start Your Recitation Journey Today
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 540, lineHeight: 1.75, fontSize: "1.05rem" }}>
                Join thousands of learners who have transformed their Quran recitation
                with our AI-powered platform. Begin with a free trial today.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={1}>
                <Button
                  component={NavLink} to="/login"
                  variant="contained" size="large"
                  sx={{
                    bgcolor: G.white, color: G.green,
                    px: 5, py: 1.5, borderRadius: 2.5,
                    fontWeight: 700, fontSize: "1rem",
                    "&:hover": { bgcolor: G.greenPale },
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}
                >
                  Join Free
                </Button>
                <Button
                  component={NavLink} to="/subscription"
                  variant="outlined" size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.6)", color: G.white,
                    px: 5, py: 1.5, borderRadius: 2.5, fontWeight: 600,
                    "&:hover": { borderColor: G.white, bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  View Plans
                </Button>
              </Stack>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          EXISTING REVIEWS + FEEDBACK (untouched)
      ══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: G.white }}>
        <Reviews />
        <Feedback />
      </Box>

    </NavLayout>
  );
}
