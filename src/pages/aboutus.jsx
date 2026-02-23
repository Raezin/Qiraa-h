import { Box, Container, Typography, Grid, Paper, Stack } from "@mui/material";
import { motion } from "framer-motion";
import NavLayout from "../layout/navlayout";

import ReactLogo from "../assets/react.svg";
import ViteLogo from "../assets/vite.svg";
import FBLogo from "../assets/firebase.svg";
import HFLogo from "../assets/huggingface.svg";
import AbdulBasit from "../assets/Abdulbasit.jpg";
import STTLogo from "../assets/STT.svg";
import TTSLogo from "../assets/TTS.svg";

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const circleImageStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid rgba(255,255,255,0.12)",
};

export default function AboutUs() {
  return (
    <NavLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Stack spacing={1.5} sx={{ mb: 6 }}>
            <Typography variant="h2" textAlign="center">
              About Qiraa’H
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", px: 6 }}
              textAlign="center"
            >
              Qiraa’H is a Quran recitation evaluation platform designed to
              combine authentic recitation standards with modern AI-assisted
              analysis.
            </Typography>
          </Stack>

          {/* IMPORTANT: stretch rows */}
          <Grid container spacing={4} alignItems="stretch">
            {/* Software Stack */}
            <Grid item size={12}>
              <Paper
                component={motion.div}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  {/* Text */}
                  <Grid item size={{ xs: 12, md: 7 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      Software Stack
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qiraa’H is built on a modern, scalable, and
                      performance-focused technology stack. The frontend is
                      developed using React with Vite, ensuring fast builds,
                      efficient bundling, and a smooth user experience.
                      <br />
                      <br />
                      Authentication and data management are handled through
                      Firebase, enabling secure access control and real-time
                      synchronization.
                      <br />
                      <br />
                      AI services are deployed on Hugging Face Spaces, allowing
                      scalable and efficient model inference.
                    </Typography>
                  </Grid>

                  {/* Logos */}
                  <Grid item size={{ xs: 12, md: 5 }}>
                    <Box
                      sx={{
                        display: { xs: "flex", md: "grid" },
                        gridTemplateColumns: { md: "repeat(2, 1fr)" },
                        gap: 3,
                        justifyContent: { xs: "center" },
                        justifyItems: "center",
                        alignItems: "center",
                        flexWrap: { xs: "wrap" },
                      }}
                    >
                      <Box
                        component="img"
                        src={ReactLogo}
                        sx={{
                          ...circleImageStyle,
                          transform: { md: "translateY(-6px)" },
                        }}
                      />
                      <Box
                        component="img"
                        src={ViteLogo}
                        sx={{
                          ...circleImageStyle,
                          transform: { md: "translateX(10px)" },
                        }}
                      />
                      <Box
                        component="img"
                        src={FBLogo}
                        sx={{
                          ...circleImageStyle,
                          transform: { md: "translateX(-8px)" },
                        }}
                      />
                      <Box
                        component="img"
                        src={HFLogo}
                        sx={{
                          ...circleImageStyle,
                          transform: { md: "translateY(8px)" },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Supported Reciters */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                component={motion.div}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  Supported Reciters
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Qiraa’H currently supports recitations modeled after Shaykh
                  Abdul Basit ‘Abd us-Samad, a globally respected reciter known
                  for exceptional Tajweed, clarity, and balance.
                  <br />
                  <br />
                  Future updates will introduce additional male and female
                  reciters to broaden learning exposure.
                </Typography>

                <Box
                  sx={{
                    mt: "auto",
                    pt: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={AbdulBasit}
                    alt="Shaykh Abdul Basit"
                    sx={{ ...circleImageStyle, width: 80, height: 80 }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* AI Models & Workflow */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                component={motion.div}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  AI Models & Workflow
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  The evaluation pipeline uses Whisper for speech recognition,
                  LSTM-based models for pronunciation accuracy, and FastSpeech 2
                  for corrective audio generation. This ensures precise feedback
                  and immediate learning support.
                  <br />
                  <br />
                  Currently, TTS models support Abdul Basit recitation, with
                  additional voices in development.
                </Typography>

                <Box
                  sx={{
                    mt: "auto",
                    pt: 2,
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Box component="img" src={STTLogo} sx={circleImageStyle} />
                  <Box
                    component="img"
                    src={TTSLogo}
                    sx={{ ...circleImageStyle, transform: "translateY(6px)" }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Contact */}
            <Grid item size={12}>
              <Paper
                component={motion.div}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  Contact Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qiraa’H — Quran Recitation Evaluation Platform
                  <br />
                  <br />
                  Email: support@qiraah.ai
                  <br />
                  Phone: +1 (000) 123-4567
                  <br />
                  <br />
                  Office Hours: Monday to Friday, 9:00 AM – 5:00 PM (GMT)
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </NavLayout>
  );
}
