import axios from "axios";

const API_URL = "http://localhost:8000";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/signin`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/signout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging out.";
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/signup`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
