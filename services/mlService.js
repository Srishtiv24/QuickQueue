const axios = require("axios");

const ML_URL = "https://web-production-1cc61.up.railway.app/predict";

async function getPredictedWaitTime(payload) {
  try {
    const response = await axios.post(
      ML_URL,
      payload,
      { timeout: 3000 } // Timeout protection
    );

    return response.data.predicted_wait_time_minutes;
  } catch (error) {
    console.error("ML Service Error:", error.message);
    return null; // Fallback trigger
  }
}

module.exports = getPredictedWaitTime;
