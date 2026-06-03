import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAssetStore = create((set) => ({
  assets: [],
  myAssets: [],
  loading: false,
  buying: false, 

  // =========================
  // Get All Assets
  // =========================
  getAssets: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/assets");

      set({
        assets: res.data.assets,
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({ loading: false });

      toast.error(
        error.response?.data?.message || "Failed to fetch assets"
      );
    }
  },

  // =========================
  // Buy Asset
  // =========================
  buying: false,
  buyAsset: async (assetId, quantity) => {
    try {
      
      set({ buying: true });

      const res = await axiosInstance.post("/user-assets/buy", {
        assetId,
        quantity,
      });

      toast.success(res.data.message);

      set({ loading: false });
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message || "Failed to buy asset"
      );
    }
    finally {
    set({ buying: false });
  }
  },

  // =========================
  // Get My Assets
  // =========================
  getMyAssets: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get(
        "/user-assets/my-assets"
      );

      set({
        myAssets: res.data.investments,
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({ loading: false });

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch investments"
      );
    }
  },

  // =========================
  // Claim Reward
  // =========================
claimReward: async (investmentId) => {
  try {
    set({ loading: true });

    const res = await axiosInstance.post(
      "/user-assets/claim",
      {
        investmentId,
      }
    );

    // Refresh assets instantly
    const updatedAssets = await axiosInstance.get(
      "/user-assets/my-assets"
    );

    set({
      myAssets: updatedAssets.data.investments,
      loading: false,
    });

    toast.success(res.data.message);

  } catch (error) {
    set({ loading: false });

    toast.error(
      error.response?.data?.message ||
        "Failed to claim reward"
    );
  }
},
  // =========================
  // Update Asset
  // =========================
  updateAsset: async (assetId, formData) => {
    try {
      set({ loading: true });

      const res = await axiosInstance.put(
        `/assets/update/${assetId}`,
        formData
      );

      set((state) => ({
        assets: state.assets.map((asset) =>
          asset._id === assetId
            ? res.data.asset
            : asset
        ),
        loading: false,
      }));

      toast.success(res.data.message);

    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message ||
          "Failed to update asset"
      );
    }
  },

  // =========================
  // Delete Asset
  // =========================
  deleteAsset: async (assetId) => {
    try {
      set({ loading: true });

      const res = await axiosInstance.delete(
        `/assets/${assetId}`
      );

      set((state) => ({
        assets: state.assets.filter(
          (asset) => asset._id !== assetId
        ),
        loading: false,
      }));

      toast.success(res.data.message);

    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message ||
          "Failed to delete asset"
      );
    }
  },
}));