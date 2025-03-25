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
      return date.toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      });
    }
  };

  return (
    <div>
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
        <div className="rounded-lg p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Message</th>
                <th className="p-4 text-left">Time Received</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors text-sm"
                >
                  <td className="p-4">{message.name}</td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center">
                      {message.email}{" "}
                      <span>
                        <Tooltip
                          placement="top"
                          title={`Mail to ${message.email}`}
                          className="justify-center "
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              window.open(`mailto:${message.email}`, "_blank")
                            }
                            sx={{ color: "#6b7280" }} // Change the color here
                          >
                            <FaEnvelope size={20} />
                          </IconButton>
                        </Tooltip>
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{message.subject}</td>
                  <td
                    className="p-4"
                    dangerouslySetInnerHTML={{
                      __html: message.message.replace(/\n/g, "<br />"),
                    }}
                  ></td>
                  <td className="p-4">{formatTimestamp(message.timestamp)}</td>
                  <td className="p-4">
                    <button
                      className="text-red-500 px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                      onClick={() => openDeleteDialog(message)}
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

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#121212", // Dark background
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
