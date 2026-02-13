import instance from ".";

/**
 * Get all educational content with filters
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.contentType - Filter by content type
 * @param {string} params.search - Search term
 * @param {string} params.sort - Sort field (createdAt, views, title)
 * @param {string} params.order - Sort order (asc, desc)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 */
const getAllContent = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `/educational-content${queryString ? `?${queryString}` : ""}`;

    const { data } = await instance.get(url);
    return data;
  } catch (error) {
    console.error(
      "Error fetching content:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get content by ID (increments views)
 * @param {string} id - Content ID
 */
const getContentById = async (id) => {
  try {
    const { data } = await instance.get(`/educational-content/${id}`);
    return data;
  } catch (error) {
    console.error(
      "Error fetching content:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get content by category
 * @param {string} category - Category name
 */
const getContentByCategory = async (category) => {
  try {
    const { data } = await instance.get(
      `/educational-content/category/${category}`,
    );
    return data;
  } catch (error) {
    console.error(
      "Error fetching content by category:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Create new educational content (Admin only)
 * @param {FormData} formData - Form data with content fields and optional photo
 */
const createContent = async (formData) => {
  try {
    const { data } = await instance.post("/educational-content", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error(
      "Error creating content:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Update educational content (Admin only)
 * @param {string} id - Content ID
 * @param {FormData} formData - Form data with updated fields and optional photo
 */
const updateContent = async (id, formData) => {
  try {
    const { data } = await instance.put(
      `/educational-content/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    console.error(
      "Error updating content:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Delete educational content (Admin only)
 * @param {string} id - Content ID
 */
const deleteContent = async (id) => {
  try {
    const { data } = await instance.delete(`/educational-content/${id}`);
    return data;
  } catch (error) {
    console.error(
      "Error deleting content:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get content statistics (Admin only)
 */
const getContentStats = async () => {
  try {
    const { data } = await instance.get("/educational-content/stats/overview");
    return data;
  } catch (error) {
    console.error(
      "Error fetching content stats:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export {
  getAllContent,
  getContentById,
  getContentByCategory,
  createContent,
  updateContent,
  deleteContent,
  getContentStats,
};
