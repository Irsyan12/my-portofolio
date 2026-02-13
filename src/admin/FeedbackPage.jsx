import React, { useState, useEffect } from "react";
import { FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import { feedbackAPI } from "../api";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

// Transition for dialog animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FeedbackPage = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
  });

  // Fetch feedback and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch feedback and stats in parallel
        const [feedbackResponse, statsResponse] = await Promise.all([
          feedbackAPI.getAll({ sortBy: "createdAt", sortOrder: "desc" }),
          feedbackAPI.getStats(),
        ]);

        if (feedbackResponse.success) {
          setFeedbackItems(feedbackResponse.data);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openDeleteDialog = (item) => {
    setDeleteDialog({
      open: true,
      item: item,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      item: null,
    });
  };

  const deleteFeedbackItem = async () => {
    setIsLoadingDelete(true);
    try {
      const itemToDelete = deleteDialog.item;
      if (!itemToDelete) return;

      const response = await feedbackAPI.delete(itemToDelete._id);

      if (response.success) {
        setFeedbackItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete._id)
        );

        // Update stats
        if (stats) {
          setStats({
            ...stats,
            totalFeedback: stats.totalFeedback - 1,
            feedbackByRating: stats.feedbackByRating.map((rating) =>
              rating._id === itemToDelete.rating
                ? { ...rating, count: rating.count - 1 }
                : rating
            ),
          });
        }

        setSnackbar({
          open: true,
          message: "Feedback deleted successfully!",
          severity: "success",
        });
      }

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
      closeDeleteDialog();
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400" size={16} />
            ) : (
              <FaRegStar className="text-gray-500" size={16} />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <h1 className="text-color1 text-2xl md:text-3xl font-bold mb-6">
        Feedback
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Average Rating Card */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-2">Average Rating</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-color1 text-4xl font-bold">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <FaStar className="text-yellow-400" size={24} />
                    </div>
                    <p className="text-gray-500 text-xs">
                      from {stats.totalFeedback} feedback
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Total Feedback Card */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-2">Total Feedback</p>
                    <span className="text-color1 text-4xl font-bold">
                      {stats.totalFeedback}
                    </span>
                    <p className="text-gray-500 text-xs mt-2">
                      {stats.recentFeedback} in last 7 days
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Distribution Card */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <p className="text-gray-400 text-sm mb-3 text-center">
                    Rating Distribution
                  </p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const ratingData = stats.feedbackByRating.find(
                        (r) => r._id === rating
                      );
                      const count = ratingData ? ratingData.count : 0;
                      const percentage =
                        stats.totalFeedback > 0
                          ? (count / stats.totalFeedback) * 100
                          : 0;

                      return (
                        <div
                          key={rating}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="flex items-center gap-1 w-16">
                            <FaStar className="text-yellow-400" size={12} />
                            <span className="text-gray-300">{rating}</span>
                          </div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-color1 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback List */}
          {feedbackItems.length === 0 ? (
            <div className="rounded-lg p-8 text-center">
              <p className="text-gray-300">No feedback found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {feedbackItems.map((item) => (
                <Card
                  key={item._id}
                  sx={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: "12px !important" }}>
                    <div className="flex flex-col items-center gap-2">
                      {/* Star Rating */}
                      <div className="flex-shrink-0">
                        {renderStars(item.rating)}
                      </div>

                      {/* Timestamp */}
                      <span className="text-gray-500 text-xs text-center">
                        {formatTimestamp(item.createdAt)}
                      </span>

                      {/* Delete Button */}
                      <button
                        className="text-red-500 hover:text-red-400 transition-colors cursor-pointer mt-1"
                        onClick={() => openDeleteDialog(item)}
                        disabled={isLoadingDelete}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#121212",
            color: "#c5f82a",
          },
        }}
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#f8f8f8" }}
          >
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isLoadingDelete}>
            Cancel
          </Button>
          <Button
            onClick={deleteFeedbackItem}
            color="error"
            autoFocus
            disabled={isLoadingDelete}
            startIcon={
              isLoadingDelete && (
                <CircularProgress size={16} sx={{ color: "inherit" }} />
              )
            }
          >
            {isLoadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FeedbackPage;
