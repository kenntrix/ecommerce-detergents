import axios from "axios";

const API_URL = "http://localhost:8000";

export const fetchOrdersByUserID = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/user/${userId}`, {
      withCredentials: true,
    });

    return response?.data || null;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const fetchOrdersByID = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
      withCredentials: true,
    });

    return response?.data || null;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
