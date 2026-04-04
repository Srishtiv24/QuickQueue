const axios = require("axios");

const ML_URL = "https://ml-service-queue-management.onrender.com/predict";

async function getPredictedWaitTime(payload) {
  try {
    console.log("Sending to ML:", payload);

    const response = await axios.post(
      ML_URL,
      payload,
      { timeout: 10000 }
    );

    console.log("ML Response:", response.data);

    return response.data.predicted_wait_time_minutes;

  } catch (error) {
    console.error("ML Service Error FULL:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return null;
  }
}

module.exports = getPredictedWaitTime;