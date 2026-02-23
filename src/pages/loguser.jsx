import React, { useState } from "react";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import Login from "../components/RegisterUser/login";
import Signup from "../components/RegisterUser/signup";

export default function LogUser() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 30% 30%, rgba(124,124,255,0.12), #0e0e10 75%)",
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            backgroundColor: "rgba(16,16,20,0.9)",
            border: "1px solid rgba(124,124,255,0.15)",
          }}
        >
          {/* LEFT BRAND PANEL */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              p: 5,
              background:
                "linear-gradient(135deg, rgba(124,124,255,0.25), rgba(0,0,0,0.9))",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#e5e5e5" }}
            >
              
            </Typography>

            <Stack spacing={1}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#fff" }}
              >
                Be a Part of
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#fff" }}
              >
                Something{" "}
                <Box component="span" sx={{ color: "#7c7cff" }}>
                  Beautiful
                </Box>
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.875rem",
              }}
            >
              © {new Date().getFullYear()} Qiraa'H. All rights reserved.
            </Typography>
          </Box>

          {/* RIGHT AUTH PANEL */}
          <Box
            sx={{
              position: "relative",
              p: { xs: 3, sm: 5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(18,18,22,0.95)",
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: "#e5e5e5",
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ width: "100%", maxWidth: 380 }}>
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <Login key="login" switchForm={() => setIsLogin(false)} />
                ) : (
                  <Signup key="signup" switchForm={() => setIsLogin(true)} />
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
