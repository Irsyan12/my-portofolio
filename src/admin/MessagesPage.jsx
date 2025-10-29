import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaTrash,
  FaStar,
  FaRegStar,
  FaEye,
  FaArchive,
  FaCircle,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { messagesAPI } from "../api";
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
        <>
          {/* Active Messages (new & read) */}
          <div className="grid gap-6 md:grid-cols-2">
            {messages
              .filter((msg) => msg.status !== "archived")
              .map((message) => {
                const statusBadge = getStatusBadge(message.status);
                return (
                  <div
                    key={message._id}
                    className="relative bg-[#18181b] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col gap-4 transition-transform hover:-translate-y-0.5 hover:shadow-2xl overflow-x-auto md:overflow-visible"
                  >
                    {/* Status Badge & Star at top left */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Chip
                        icon={statusBadge.icon}
                        label={statusBadge.label}
                        size="small"
                        color={statusBadge.color}
                        variant={statusBadge.variant}
                        sx={{
                          height: "24px",
                          fontSize: "0.75rem",
                          "& .MuiChip-icon": {
                            fontSize: "0.75rem",
                            marginLeft: "8px",
                          },
                        }}
                      />
                      <Tooltip
                        title={
                          message.status === "read"
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRead(message)}
                          sx={{ color: "#c5f82a" }}
                        >
                          {message.status === "read" ? (
                            <FaEnvelopeOpen size={16} />
                          ) : (
                            <FaEnvelope size={16} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>

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
                      {formatTimestamp(message.createdAt)}
                      <Tooltip title={message.isStarred ? "Unstar" : "Star"}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStar(message._id)}
                          sx={{
                            color: message.isStarred ? "#fbbf24" : "#6b7280",
                          }}
                        >
                          {message.isStarred ? (
                            <FaStar size={16} />
                          ) : (
                            <FaRegStar size={16} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-8">
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
                          <span className="break-all">{message.email}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Toggle Read/Unread */}

                        {/* Archive button */}
                        <Tooltip title="Archive">
                          <IconButton
                            size="small"
                            onClick={() => handleArchive(message._id)}
                            sx={{ color: "#9ca3af" }}
                          >
                            <FaArchive size={16} />
                          </IconButton>
                        </Tooltip>

                        {/* Delete button */}
                        <Tooltip title="Delete message">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(message)}
                            sx={{ color: "#ef4444" }}
                          >
                            <FaTrash size={16} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Message Content Card */}
                    <div className="bg-[#23232a] h-full rounded-lg p-4 mt-2 border border-gray-700 flex items-start gap-3 overflow-x-auto md:overflow-visible">
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
                );
              })}
          </div>

          {/* Archived Messages Section */}
          {messages.filter((msg) => msg.status === "archived").length > 0 && (
            <>
              <div className="my-8 border-t border-gray-700"></div>
              <h2 className="text-color1 text-xl md:text-2xl font-bold mb-4">
                Archived Messages
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {messages
                  .filter((msg) => msg.status === "archived")
                  .map((message) => {
                    const statusBadge = getStatusBadge(message.status);
                    return (
                      <div
                        key={message._id}
                        className="relative bg-[#18181b] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-2xl overflow-x-auto md:overflow-visible opacity-75"
                      >
                        {/* Status Badge & Star at top left */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <Chip
                            icon={statusBadge.icon}
                            label={statusBadge.label}
                            size="small"
                            color={statusBadge.color}
                            variant={statusBadge.variant}
                            sx={{
                              height: "24px",
                              fontSize: "0.75rem",
                              "& .MuiChip-icon": {
                                fontSize: "0.75rem",
                                marginLeft: "8px",
                              },
                            }}
                          />
                          <Tooltip
                            title={message.isStarred ? "Unstar" : "Star"}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStar(message._id)}
                              sx={{
                                color: message.isStarred
                                  ? "#fbbf24"
                                  : "#6b7280",
                              }}
                            >
                              {message.isStarred ? (
                                <FaStar size={16} />
                              ) : (
                                <FaRegStar size={16} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </div>

                        {/* Time at top right */}
                        <div className="absolute top-4 right-6 flex items-center gap-1 text-xs text-gray-400">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            className="mr-1"
                          >
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
                          {formatTimestamp(message.createdAt)}
                        </div>

                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-8">
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
                                    window.open(
                                      `mailto:${message.email}`,
                                      "_blank"
                                    )
                                  }
                                  sx={{ color: "#c5f82a" }}
                                >
                                  <FaEnvelope size={16} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {/* Unarchive button */}
                            <Tooltip title="Unarchive">
                              <IconButton
                                size="small"
                                onClick={() => handleUnarchive(message._id)}
                                sx={{ color: "#c5f82a" }}
                              >
                                <FaEnvelope size={16} />
                              </IconButton>
                            </Tooltip>

                            {/* Delete button */}
                            <Tooltip title="Delete message">
                              <IconButton
                                size="small"
                                onClick={() => openDeleteDialog(message)}
                                sx={{ color: "#ef4444" }}
                              >
                                <FaTrash size={16} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Message Content Card */}
                        <div className="bg-[#23232a] h-full rounded-lg p-4 mt-2 border border-gray-700 flex items-start gap-3 overflow-x-auto md:overflow-visible">
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
