// src/apis/sensor.js
import instance from ".";

const getLatestSensorData = async () => {
  try {
    console.log("🔍 Fetching sensor data from API...");
    const response = await instance.get("/api/sensor-data/latest");
    console.log("📦 Full API Response:", JSON.stringify(response, null, 2));
    console.log("📊 Response data:", response.data);

    // Check the structure
    if (response.data && response.data.data) {
      console.log("✅ Sensor data found:", response.data.data);
      return response.data.data; // Return the actual sensor data
    } else {
      console.log("❌ No sensor data in response");
      return null;
    }
  } catch (error) {
    console.error("🚨 Error fetching sensor data:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export { getLatestSensorData };
