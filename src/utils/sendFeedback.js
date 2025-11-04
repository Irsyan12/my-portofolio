import { feedbackAPI } from "../api";

/**
 * Send feedback with rating to backend
 * @param {Object} feedbackData - Feedback data
 * @param {number} feedbackData.rating - Rating (1-5)
 * @param {string} feedbackData.comment - Optional comment
 * @returns {Promise<boolean>} Success status
 */
const sendFeedback = async (feedbackData) => {
  try {
    const response = await feedbackAPI.create(feedbackData);
    return response.success;
  } catch (error) {
    console.error("Error sending feedback:", error);
    return false;
  }
};

export { sendFeedback };
