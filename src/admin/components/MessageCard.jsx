import React from "react";
import {
  FaEnvelope,
  FaTrash,
  FaStar,
  FaRegStar,
  FaArchive,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { Chip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const MessageCard = ({
  message,
  statusBadge,
  formatTimestamp,
  handleToggleRead,
  handleToggleStar,
  handleArchive,
  handleUnarchive,
  openDeleteDialog,
  isArchived = false,
}) => {
  return (
    <div
      className={`relative bg-[#18181b] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col gap-4 transition-transform hover:-translate-y-0.5 hover:shadow-2xl overflow-x-auto md:overflow-visible ${
        isArchived ? "opacity-75 hover:-translate-y-1" : ""
      }`}
    >
      {/* Status Badge & Toggle Read Button at top left */}
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
        {!isArchived && (
          <Tooltip
            title={
              message.status === "read" ? "Mark as unread" : "Mark as read"
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
        )}
        {isArchived && (
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
        )}
      </div>

      {/* Time & Star at top right */}
      <div className="absolute top-4 right-6 flex items-center gap-1 text-xs text-gray-400">
        <svg width="16" height="16" fill="none" className="mr-1">
          <path
            d="M8 3v5l4 2"
            stroke="#c5f82a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="8" r="6.25" stroke="#c5f82a" strokeWidth="1.5" />
        </svg>
        {formatTimestamp(message.createdAt)}
        {!isArchived && (
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
        )}
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
            {isArchived && <FaEnvelope size={14} className="mr-1" />}
            <span className="break-all">{message.email}</span>
            <Tooltip title={`Mail to ${message.email}`}>
              <IconButton
                size="small"
                onClick={() => window.open(`mailto:${message.email}`, "_blank")}
                sx={{ color: "#c5f82a" }}
              >
                <FaEnvelope size={16} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Archive/Unarchive button */}
          {!isArchived ? (
            <Tooltip title="Archive">
              <IconButton
                size="small"
                onClick={() => handleArchive(message._id)}
                sx={{ color: "#9ca3af" }}
              >
                <FaArchive size={16} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Unarchive">
              <IconButton
                size="small"
                onClick={() => handleUnarchive(message._id)}
                sx={{ color: "#c5f82a" }}
              >
                <FaEnvelope size={16} />
              </IconButton>
            </Tooltip>
          )}

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
};

export default MessageCard;
