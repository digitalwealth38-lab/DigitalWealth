import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // allows cookies (for JWT)
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBlocked =
      error.response?.status === 403 &&
      error.response?.data?.code === "USER_BLOCKED";

    const isOnBlockedPage = window.location.pathname === "/blocked";

    if (isBlocked && !isOnBlockedPage) {
      window.location.replace("/blocked");
    }

    return Promise.reject(error);
  }
);