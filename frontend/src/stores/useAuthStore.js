import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingProfileData: false,
  isCheckingAuth: true,
  pendingEmail: null, // email waiting for OTP verification

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  handleGoogleLogin: async () => {
    try {
      const result  = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res     = await axiosInstance.post("/auth/google-login", { token: idToken }, { withCredentials: true });
      set({ authUser: res.data.user || res.data });
      toast.success("Google login successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Google login failed");
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      console.log(res)
      if (res.data.requiresVerification) {
        // Don't set authUser yet — go to OTP screen
        set({ pendingEmail: res.data.email });
        toast.success("Account created! Check your email for the OTP.");
        return { requiresVerification: true, email: res.data.email };
      }
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      set({ isSigningUp: false });
    }
  },

login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    console.log(res.data);
    set({ authUser: res.data });
    toast.success("Logged in successfully");
  } catch (error) {
    const errData = error?.response?.data;
    console.log("login error response:", errData);

    // ✅ 403 = unverified email — handle it here, not in try
    if (error?.response?.status === 403 && errData?.requiresVerification) {
      set({ pendingEmail: errData.email });
      toast("Please verify your email first.", { icon: "📧" });
      return { requiresVerification: true, email: errData.email };
    }

    toast.error(errData?.message || "Something went wrong!");
  } finally {
    set({ isLoggingIn: false });
  }
},

  verifyOTP: async ({ email, otp }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      set({ authUser: res.data.user, pendingEmail: null });
      toast.success("Email verified! Welcome 🎉");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
      return false;
    }
  },

  resendOTP: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/resend-otp", { email });
      toast.success(res.data.message || "OTP resent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileData: async (data) => {
    set({ isUpdatingProfileData: true });
    try {
      const res = await axiosInstance.put("/auth/update", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
      throw error;
    } finally {
      set({ isUpdatingProfileData: false });
    }
  },
}));