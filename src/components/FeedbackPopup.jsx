import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  IconButton,
  Slide,
} from "@mui/material";
import { FaTimes, FaStar } from "react-icons/fa";
import { feedbackAPI } from "../api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FeedbackPopup = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already submitted feedback in this session
    const feedbackSubmitted = sessionStorage.getItem("feedbackSubmitted");
    const feedbackDismissed = sessionStorage.getItem("feedbackDismissed");

    if (feedbackSubmitted || feedbackDismissed) {
      return;
    }

    // Random delay between 2-4 minutes (120000ms - 240000ms)
    const randomDelay =
      Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;

    const timer = setTimeout(() => {
      setOpen(true);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("feedbackDismissed", "true");
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await feedbackAPI.create({
        rating,
        comment: comment.trim() || undefined,
      });

      if (response.success) {
        setHasSubmitted(true);
        sessionStorage.setItem("feedbackSubmitted", "true");

        // Close after 2 seconds
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1a1a1a",
          backgroundImage: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
          borderRadius: "16px",
          border: "1px solid rgba(197, 248, 42, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      {!hasSubmitted ? (
        <>
          <DialogTitle
            sx={{
              color: "#c5f82a",
              fontWeight: "bold",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <div className="flex items-center gap-2">
              <FaStar className="text-color1" size={24} />
              <span>Rate Your Experience</span>
            </div>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: "#9ca3af",
                "&:hover": { color: "#c5f82a" },
              }}
            >
              <FaTimes />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-4">
                How would you rate your experience visiting my portfolio?
              </p>

              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
                sx={{
                  fontSize: "3rem",
                  "& .MuiRating-iconFilled": {
                    color: "#c5f82a",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#d4ff4d",
                  },
                }}
              />
            </div>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Any additional comments? (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "rgba(197, 248, 42, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(197, 248, 42, 0.4)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#c5f82a",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#9ca3af",
                  opacity: 1,
                },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: "#9ca3af",
                "&:hover": {
                  backgroundColor: "rgba(156, 163, 175, 0.1)",
                },
              }}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              variant="contained"
              sx={{
                backgroundColor: "#c5f82a",
                color: "#000",
                fontWeight: "bold",
                px: 3,
                "&:hover": {
                  backgroundColor: "#d4ff4d",
                },
                "&:disabled": {
                  backgroundColor: "rgba(197, 248, 42, 0.3)",
                  color: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent sx={{ textAlign: "center", py: 6 }}>
            <div className="mb-4">
              <div className="w-16 h-16 bg-color1 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-color1 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-300">
                Your feedback has been submitted successfully.
              </p>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default FeedbackPopup;
