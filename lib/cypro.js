import axios from "axios";

const API_KEY = process.env.VEHICLE_API_KEY;

export async function sendToCypro(payload, retries = 3) {
  try {
    const response = await axios.post(
      "https://salesapp-api.cyepro.com/sales/lead/broadCast-leads",
      payload,
      {
        headers: {
          "API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 30000,
        validateStatus: () => true,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    if (response.status >= 400 && response.status < 500) {
      throw new Error(`Cypro rejected lead: ${response.status}`);
    }

    throw new Error(`Cypro server error: ${response.status}`);
  } catch (error) {
    if (retries > 0) {
      const delay = (4 - retries) * 2000;

      await new Promise((r) => setTimeout(r, delay));

      return sendToCypro(payload, retries - 1);
    }

    throw error;
  }
}