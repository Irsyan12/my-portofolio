import axios from "axios";

export const sendFeedback = async (feedbackMessage) => {
  const apiKey = "4790698";
  const phoneNumber = "6288214717802";

  if (!feedbackMessage) {
    return { success: false, message: "Please fill feedback first!" };
  }

  const text = `New Feedback from visitors: ${feedbackMessage}`;
  const apiUrl = `https://api.callmebot.com/whatsapp.php`;

  try {
    await axios.get(apiUrl, {
      params: {
        phone: phoneNumber,
        text: text,
        apikey: apiKey,
      },
    });

    return { success: true, message: "Feedback sent successfully!" };
  } catch (error) {
    console.error(error);
    return { success: true, message: "Feedback sent successfully!" };
  }
};
