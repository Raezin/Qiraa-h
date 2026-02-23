import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { motion, useInView } from "framer-motion";

export default function Feedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  const handleSubmit = () => {
    const email = "abaansohail131@gmail.com";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoLink;
  };

  return (
    <Box
      sx={{ py: 10, px: { xs: 2, md: 6 } , overflow: "hidden"}}
      ref={sectionRef}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        maxWidth="1200px"
        mx="auto"
      >
        {/* LEFT SIDE */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Typography variant="h2" mb={2}>
              Have a Question or Idea?
            </Typography>

            <Typography color="text.secondary" mb={3}>
              If you have any queries related to results, development,
              suggestions, or new ideas, feel free to reach out to us.
              We are always happy to hear from you.
            </Typography>

            <Typography color="text.secondary">
              You can also contact us directly at:
            </Typography>

            <Typography fontWeight={500} mt={1}>
              abaansohail131@gmail.com
            </Typography>
          </motion.div>
        </Grid>

        {/* RIGHT SIDE FORM */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.15,
            }}
          >
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h3" mb={3}>
                Send Feedback
              </Typography>

              <TextField
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField
                label="Comments"
                multiline
                rows={4}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 4 }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={!subject || !message}
              >
                Send Message
              </Button>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
