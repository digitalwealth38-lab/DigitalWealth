import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  // Fetch the logged-in user's dashboard data
  fetchUser: async () => {
    try {
      const res = await axiosInstance.get("/users/me", {
        withCredentials: true, // ✅ correct for axios
      });

      set({ user: res.data }); // ✅ axios already gives parsed JSON
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ user: null });
    }
  },
}));
