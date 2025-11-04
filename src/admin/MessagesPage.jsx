import React, { useState, useEffect } from "react";
import { FaStar, FaEye, FaArchive, FaCircle } from "react-icons/fa";
import { messagesAPI } from "../api";
import MessageCard from "./components/MessageCard";
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
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { formatDistanceToNow, differenceInDays } from "date-fns";

// Transition untuk animasi dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
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

  // State untuk status menu
  const [statusMenu, setStatusMenu] = useState({
    anchorEl: null,
    message: null,
  });

  // Fetch messages dari MongoDB
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await messagesAPI.getAll({
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
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

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      message: null,
    });
  };

  // Handle star toggle
  const handleToggleStar = async (messageId) => {
    try {
      const response = await messagesAPI.toggleStar(messageId);

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Open status menu
  const handleStatusMenuOpen = (event, message) => {
    setStatusMenu({
      anchorEl: event.currentTarget,
      message: message,
    });
  };

  // Close status menu
  const handleStatusMenuClose = () => {
    setStatusMenu({
      anchorEl: null,
      message: null,
    });
  };

  // Toggle read/unread status
  const handleToggleRead = async (message) => {
    const newStatus = message.status === "read" ? "new" : "read";

    try {
      const response = await messagesAPI.updateStatus(message._id, newStatus);

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === message._id ? { ...msg, status: newStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Archive message
  const handleArchive = async (messageId) => {
    try {
      const response = await messagesAPI.updateStatus(messageId, "archived");

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, status: "archived" } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error archiving message:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Unarchive message
  const handleUnarchive = async (messageId) => {
    try {
      const response = await messagesAPI.updateStatus(messageId, "new");

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, status: "new" } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error unarchiving message:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    const message = statusMenu.message;
    handleStatusMenuClose();

    if (!message) return;

    try {
      const response = await messagesAPI.updateStatus(message._id, newStatus);

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === message._id ? { ...msg, status: newStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Delete message
  const deleteMessage = async () => {
    setIsLoadingDelete(true);
    try {
      const messageToDelete = deleteDialog.message;
      if (!messageToDelete) return;

      const response = await messagesAPI.delete(messageToDelete._id);

      if (response.success) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== messageToDelete._id)
        );
      }

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting message:", error);
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

  // Fungsi untuk memformat timestamp
  const formatTimestamp = (timestamp) => {
    // Handle both Date object and ISO string
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
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

  // Get status badge color and label
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: "primary", label: "New", icon: <FaCircle size={8} /> },
      read: {
        color: "primary",
        variant: "outlined",
        label: "Read",
        icon: <FaEye size={12} />,
      },
      archived: {
        color: "secondary",
        label: "Archived",
        variant: "outlined",
        icon: <FaArchive size={12} />,
      },
    };

    return statusConfig[status] || statusConfig.new;
  };

  // Toggle filter starred messages
  const handleToggleStarFilter = () => {
    setShowStarredOnly((prev) => !prev);
  };

  // Filter messages based on starred filter
  const getFilteredMessages = (status) => {
    const filteredByStatus = messages.filter((msg) => {
      if (status === "archived") {
        return msg.status === "archived";
      }
      return msg.status !== "archived";
    });

    if (showStarredOnly) {
      return filteredByStatus.filter((msg) => msg.isStarred);
    }

    return filteredByStatus;
  };

  // Get starred messages count
  const starredCount = messages.filter((msg) => msg.isStarred).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-color1 text-2xl md:text-3xl font-bold mb-6">
          Messages
        </h1>
        {/* Filter starred messages button */}
        <div className="flex items-center gap-2">
          <Tooltip
            title={
              showStarredOnly
                ? "Show all messages"
                : `Show starred messages (${starredCount})`
            }
          >
            <IconButton
              size="small"
              onClick={handleToggleStarFilter}
              sx={{
                color: showStarredOnly ? "#fbbf24" : "#c5f82a",
                backgroundColor: showStarredOnly
                  ? "rgba(251, 191, 36, 0.1)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: showStarredOnly
                    ? "rgba(251, 191, 36, 0.2)"
                    : "rgba(197, 248, 42, 0.1)",
                },
              }}
            >
              <FaStar size={16} />
            </IconButton>
          </Tooltip>
          {starredCount > 0 && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              {starredCount} starred
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-gray-300">No messages found.</p>
        </div>
      ) : getFilteredMessages("active").length === 0 &&
        getFilteredMessages("archived").length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <FaStar size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300">No starred messages found.</p>
          <button
            onClick={handleToggleStarFilter}
            className="mt-4 text-color1 hover:underline"
          >
            Show all messages
          </button>
        </div>
      ) : (
        <>
          {/* Active Messages (new & read) */}
          {getFilteredMessages("active").length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {getFilteredMessages("active").map((message) => {
                const statusBadge = getStatusBadge(message.status);
                return (
                  <MessageCard
                    key={message._id}
                    message={message}
                    statusBadge={statusBadge}
                    formatTimestamp={formatTimestamp}
                    handleToggleRead={handleToggleRead}
                    handleToggleStar={handleToggleStar}
                    handleArchive={handleArchive}
                    handleUnarchive={handleUnarchive}
                    openDeleteDialog={openDeleteDialog}
                    isArchived={false}
                  />
                );
              })}
            </div>
          )}

          {/* Archived Messages Section */}
          {getFilteredMessages("archived").length > 0 && (
            <>
              <div className="my-8 border-t border-gray-700"></div>
              <h2 className="text-color1 text-xl md:text-2xl font-bold mb-4">
                Archived Messages
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {getFilteredMessages("archived").map((message) => {
                  const statusBadge = getStatusBadge(message.status);
                  return (
                    <MessageCard
                      key={message._id}
                      message={message}
                      statusBadge={statusBadge}
                      formatTimestamp={formatTimestamp}
                      handleToggleRead={handleToggleRead}
                      handleToggleStar={handleToggleStar}
                      handleArchive={handleArchive}
                      handleUnarchive={handleUnarchive}
                      openDeleteDialog={openDeleteDialog}
                      isArchived={true}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenu.anchorEl}
        open={Boolean(statusMenu.anchorEl)}
        onClose={handleStatusMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#1f1f23",
            color: "#fff",
            border: "1px solid #3f3f46",
          },
        }}
      >
        <MenuItem
          onClick={() => handleStatusChange("new")}
          sx={{
            "&:hover": { backgroundColor: "#2d2d33" },
            gap: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaCircle size={8} color="#3b82f6" />
          Mark as New
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusChange("read")}
          sx={{
            "&:hover": { backgroundColor: "#2d2d33" },
            gap: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaEye size={14} color="#c5f82a" />
          Mark as Read
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusChange("archived")}
          sx={{
            "&:hover": { backgroundColor: "#2d2d33" },
            gap: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaArchive size={14} color="#9ca3af" />
          Archive
        </MenuItem>
      </Menu>

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
