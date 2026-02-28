import instance from ".";

/**
 * Upload a new foot analysis image
 * @param {FormData} formData - Must include the file under "file"
 */
const createFootAnalysis = async (formData) => {
  try {
    const { data } = await instance.post("/FootAnalysis", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error(
      "Error creating foot analysis:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get all analyses for the logged-in user
 */
const getUserAnalyses = async () => {
  try {
    const { data } = await instance.get("/FootAnalysis");
    return data;
  } catch (error) {
    console.error(
      "Error fetching user analyses:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export { createFootAnalysis, getUserAnalyses };
