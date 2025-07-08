import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FaEnvelope, FaTrash } from "react-icons/fa";
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { formatDistanceToNow, differenceInDays } from "date-fns"; // Import date-fns

// Transition untuk animasi dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false); // State untuk loading tombol delete
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // State untuk dialog konfirmasi hapus
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: null,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Buka dialog konfirmasi hapus
  const openDeleteDialog = (message) => {
    setDeleteDialog({
      open: true,
      message: message,
    });
  };

  // Tutup dialog konfirmasi hapus
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      message: null,
    });
  };

  const deleteMessage = async () => {
    setIsLoadingDelete(true); // Aktifkan loading
    try {
      const messageToDelete = deleteDialog.message;
      if (!messageToDelete) return;

      await deleteDoc(doc(db, "messages", messageToDelete.id));
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageToDelete.id)
      );

      // Tampilkan Snackbar sukses
      setSnackbar({
        open: true,
        message: "Message deleted successfully!",
        severity: "success",
      });

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting message:", error);

      // Tampilkan Snackbar error
      setSnackbar({
        open: true,
        message: "Failed to delete message!",
        severity: "error",
      });

      closeDeleteDialog();
    } finally {
      setIsLoadingDelete(false); // Matikan loading
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fungsi untuk memformat timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp?.seconds * 1000);
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
      // Keep date in Indonesian, change "pukul" to "at", keep 24-hour time format
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
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      <h1 className="text-color1 text-2xl md:text-3xl font-bold mb-6">
        Messages
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-gray-300">No messages found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="relative bg-[#18181b] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-2xl overflow-x-auto md:overflow-visible"
            >
              {/* Time at top right */}
              <div className="absolute top-4 right-6 flex items-center gap-1 text-xs text-gray-400">
                <svg width="16" height="16" fill="none" className="mr-1">
                  <path
                    d="M8 3v5l4 2"
                    stroke="#c5f82a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6.25"
                    stroke="#c5f82a"
                    strokeWidth="1.5"
                  />
                </svg>
                {formatTimestamp(message.timestamp)}
              </div>

              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex-shrink-0 bg-color1/10 rounded-full p-3">
                  <FaEnvelope size={28} className="text-color1" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-lg text-white break-words">
                    {message.name}
                  </span>
                  <div className="text-color1 font-semibold text-sm mt-1 break-words">
                    {message.subject}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                    <FaEnvelope size={14} className="mr-1" />
                    <span className="break-all">{message.email}</span>
                    <Tooltip title={`Mail to ${message.email}`}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(`mailto:${message.email}`, "_blank")
                        }
                        sx={{ color: "#c5f82a" }}
                      >
                        <FaEnvelope size={16} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                {/* Delete button */}
                <Tooltip title="Delete message">
                  <button
                    className="ml-2 cursor-pointer text-red-500 hover:bg-red-900/30 rounded-full p-2 transition"
                    onClick={() => openDeleteDialog(message)}
                  >
                    <FaTrash size={18} />
                  </button>
                </Tooltip>
              </div>

              {/* Message Content Card */}
              <div className="bg-[#23232a] rounded-lg p-4 mt-2 border border-gray-700 flex items-start gap-3 overflow-x-auto md:overflow-visible">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  className="flex-shrink-0 text-color1"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="3"
                    stroke="#c5f82a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 7l10 6 10-6"
                    stroke="#c5f82a"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className="text-gray-200 text-base break-words"
                  dangerouslySetInnerHTML={{
                    __html: message.message.replace(/\n/g, "<br />"),
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Konfirmasi Hapus */}
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
            Are you sure you want to delete this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isLoadingDelete}>
            Cancel
          </Button>
          <Button
            onClick={deleteMessage}
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

      {/* Snackbar for notifications */}
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

export default MessagesPage;
