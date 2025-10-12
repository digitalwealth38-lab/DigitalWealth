import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null, // Stores the logged-in user dashboard data
  token: localStorage.getItem("token") || null, // JWT token

  // Fetch the logged-in user's dashboard data
 fetchUser: async () => {
  try {
    const res = await fetch("http://localhost:5000/api/users/me", {
      credentials: "include", // <-- important for cookies
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    set({ user: data }); // store user globally
  } catch (err) {
    console.error(err);
    set({ user: null });
  }
},
}));
