import{create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
const API_URL = import.meta.env.VITE_API_URL;
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
  

    checkAuth:async()=>{
        try {
            const res= await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
            set({authUser:null})
        }
        finally{
            set({ isCheckingAuth: false })
        }
    },
    
handleGoogleLogin: async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get Firebase ID token (JWT)
    const idToken = await user.getIdToken();
console.log(idToken)
    // Send token to backend (dynamic URL)
    const response = await fetch(`${API_URL}/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ ensures cookies are sent
      body: JSON.stringify({ token: idToken }),
    });

    const data = await response.json();
    set({ authUser: data });
    toast.success("Google login successful");
  } catch (error) {
    console.error("Google login error:", error);
    toast.error("Google login failed");
  }
},
    signup: async (data) => {
        console.log(data)
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
         
          set({ authUser: res.data });
          toast.success("Account created successfully");
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Something went wrong!";
            toast.error(message);
          }finally {
          set({ isSigningUp: false });
        }
      },
      login: async (data) => {
        console.log(data)
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });

          toast.success("Log IN successfully");
          
        } catch (error) {
            console.log("Login Error:", error);
            const message =
              error?.response?.data?.message || error?.message || "Something went wrong!";
            toast.error(message);
          }finally {
          set({ isLoggingIn: false });
        }
      },
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    }));