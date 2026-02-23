import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const ReviewModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.text.trim()) {
      onSubmit({ rating: newReview.rating, text: newReview.text.trim() });
      handleClose();
    }
  };

  const handleClose = () => {
    setNewReview({ rating: 5, text: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" component="h2" fontWeight={500}>
              Write a Review
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                How would you rate your experience?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Rating
                  value={newReview.rating}
                  onChange={(_, newValue) => {
                    setNewReview({ ...newReview, rating: newValue || 5 });
                  }}
                  size="large"
                  sx={{
                    "& .MuiRating-icon": {
                      color: theme.palette.primary.main,
                      fontSize: '2.5rem',
                      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    },
                    "& .MuiRating-iconHover": {
                      transform: 'scale(1.15)',
                    },
                  }}
                />
              </Box>
            </Box>

            <Box mb={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Your Review *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="Share your honest experience..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                required
                error={!newReview.text.trim()}
                helperText={!newReview.text.trim() ? "Please write your review" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                  }
                }}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={!newReview.text.trim()}
                sx={{
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                Submit Review
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ReviewModal;