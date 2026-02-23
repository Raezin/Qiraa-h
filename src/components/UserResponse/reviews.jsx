import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import { motion, useInView } from "framer-motion";
import ReviewBg from "../../assets/review-banner.jpg";
import ReviewModal from "./reviewModal.jsx";

const initialReviews = [
  { name: "Ali Raza", rating: 5, text: "Amazing experience overall." },
  { name: "Sara Khan", rating: 4, text: "Very clean and modern UI." },
  { name: "Usman Tariq", rating: 5, text: "Professional and smooth." },
  { name: "Ayesha Noor", rating: 4, text: "Easy to use platform." },
  { name: "Hamza Malik", rating: 5, text: "Loved the design quality." },
  { name: "Fatima Zahid", rating: 4, text: "Everything worked perfectly." },
];

const currentUser = {
  name: "John Doe",
  isLoggedIn: true,
};

export default function Reviews() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const visibleCards = isMobile ? 1 : isTablet ? 2 : 3;

  const [reviews, setReviews] = useState(initialReviews);
  const [startIndex, setStartIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  /* ===== In View Animation ===== */
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  /* ===== Rotation Logic ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setStartIndex((prev) => (prev + visibleCards) % reviews.length);
        setVisible(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleCards, reviews.length]);

  const visibleReviews = Array.from({ length: visibleCards }).map(
    (_, i) => reviews[(startIndex + i) % reviews.length]
  );

  /* ===== Review Submit ===== */
  const handleSubmitReview = (data) => {
    setReviews((prev) => [
      { name: currentUser.name, ...data },
      ...prev,
    ]);
    setStartIndex(0);
  };

  return (
    <>
      <Box
        ref={sectionRef}
        sx={{
          minHeight: "70vh",
          backgroundImage: `linear-gradient(rgba(14,14,16,.65), rgba(22,22,26,.6)), url(${ReviewBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          px: 2,
          py: 8,
        }}
      >
        <Box maxWidth="1200px" width="100%">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Box textAlign="center" mb={6}>
              <Typography variant="h2" mb={2}>
                What People Say
              </Typography>
              <Typography color="text.secondary" maxWidth={600} mx="auto">
                Honest reviews from our community members
              </Typography>
            </Box>
          </motion.div>

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: visibleCards === 2 ? "repeat(2,1fr)" : "1fr",
                md: "repeat(3,1fr)",
              }}
              gap={3}
              mb={6}
            >
              {visibleReviews.map((review, i) => (
                <Box
                  key={i}
                  sx={{
                    height: 220,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      opacity: visible ? 1 : 0,
                      filter: visible ? "blur(0px)" : "blur(4px)",
                      transition: "opacity 0.4s ease, filter 0.4s ease",
                      animation: !visible ? "shake 0.3s ease" : "none",
                      "@keyframes shake": {
                        "0%, 100%": { transform: "translateX(0)" },
                        "25%": { transform: "translateX(-4px)" },
                        "75%": { transform: "translateX(4px)" },
                      },
                    }}
                  >
                    <Box display="flex" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {review.name[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>
                          {review.name}
                        </Typography>
                        <Box display="flex">
                          {[...Array(5)].map((_, j) => (
                            <StarIcon
                              key={j}
                              fontSize="small"
                              sx={{
                                color:
                                  j < review.rating
                                    ? "#ffb74d"
                                    : theme.palette.text.disabled,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontStyle: "italic",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      "{review.text}"
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Box textAlign="center">
              <Typography variant="h3" mb={2}>
                Share Your Experience
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Help others by sharing your honest feedback
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
              >
                Write a Review
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
