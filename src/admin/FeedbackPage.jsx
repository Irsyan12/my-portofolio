import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FaTrash, FaCommentAlt } from "react-icons/fa"; // Using FaCommentAlt for feedback icon
import { db } from "../firebase/firebase";
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
} from "@mui/material";
import { formatDistanceToNow, differenceInDays } from "date-fns";

// Transition for dialog animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FeedbackPage = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
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

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const feedbackRef = collection(db, "feedback");
        const q = query(feedbackRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const feedbackData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFeedbackItems(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setSnackbar({
          open: true,
          message: `Error fetching feedback: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
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

      await deleteDoc(doc(db, "feedback", itemToDelete.id));
      setFeedbackItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToDelete.id)
      );

      setSnackbar({
        open: true,
        message: "Feedback deleted successfully!",
        severity: "success",
      });
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete feedback!",
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    const daysDifference = differenceInDays(new Date(), date);

    if (daysDifference < 1) {
      return `Today at ${date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (daysDifference === 1) {
      return `1 day ago at ${date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (daysDifference <= 3) {
      return `${formatDistanceToNow(date, {
        addSuffix: true,
      })} at ${date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      const formattedDate = date.toLocaleDateString("id-ID", {
        dateStyle: "long",
      });
      const formattedTime = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} at ${formattedTime}`;
    }
  };

  return (
    <div>
      <h1 className="text-color1 text-2xl md:text-3xl font-bold mb-6">
        Feedback
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : feedbackItems.length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-gray-300">No feedback found.</p>
        </div>
      ) : (
        <div className="rounded-lg p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left">Feedback</th>
                <th className="p-4 text-left">Time Received</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors text-sm"
                >
                  <td
                    className="p-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        item.feedbackMessage?.replace(/\n/g, "<br />") ||
                        "No message content",
                    }}
                  ></td>
                  <td className="p-4">{formatTimestamp(item.timestamp)}</td>
                  <td className="p-4">
                    <button
                      className="text-red-500 px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                      onClick={() => openDeleteDialog(item)}
                      disabled={isLoadingDelete}
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
