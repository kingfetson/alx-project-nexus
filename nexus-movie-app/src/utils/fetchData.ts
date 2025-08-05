import axios from "axios";

/**
 * Universal fetch function for API requests
 * @param url - API endpoint URL
 * @param params - Query parameters
 * @returns Response data or empty array
 */
export const fetchData = async (url: string, params = {}) => {
  try {
    const response = await axios.get(url, { params });
    return response.data.results || response.data;
  } catch (error) {
    console.error("❌ FetchData Error:", error);
    return [];
  }
};
