import axios from "axios";

const API_URL = "http://localhost:8000";

export const fetchUserCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/cart/${userId}`, {
      withCredentials: true,
    });

    return response?.data || null;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/cart/add`,
      { productId, quantity },
      {
        withCredentials: true,
      }
    );

    return response?.data || null;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
