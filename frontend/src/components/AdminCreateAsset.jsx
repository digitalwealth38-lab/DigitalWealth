import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Upload, PackagePlus } from "lucide-react";

const AdminCreateAsset = () => {
  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    profitPerProduct: "",
    duration: "",
    minPurchase: "",
    maxPurchase: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Image size validation
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result);

      setFormData({
        ...formData,
        image: reader.result,
      });
    };
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/assets/create",
        formData
      );

      toast.success(res.data.message);

      // Reset Form
      setFormData({
        name: "",
        image: "",
        price: "",
        profitPerProduct: "",
        duration: "",
        minPurchase: "",
        maxPurchase: "",
      });

      setPreviewImage("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 p-6">
      
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-sky-200 rounded-[30px] p-8 shadow-[0_10px_40px_rgba(14,165,233,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-sky-100 p-4 rounded-2xl">
            <PackagePlus className="text-sky-600" size={32} />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
              Create New Asset
            </h1>

            <p className="text-sky-700 mt-1">
              Add investment products for users
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Asset Name */}
          <div>
            <label className="block mb-2 text-sky-700 font-semibold">
              Asset Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nike Shoes"
              className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sky-700 font-semibold">
              Asset Image
            </label>

            <label className="w-full h-64 border-2 border-dashed border-sky-300 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden bg-sky-50 hover:bg-sky-100 transition-all">
              
              {previewImage ? (
                <img
                  src={previewImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-sky-500">
                  <div className="bg-sky-100 p-5 rounded-full">
                    <Upload size={40} />
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      Upload Asset Image
                    </p>

                    <p className="text-sm text-sky-400 mt-1">
                      PNG, JPG, WEBP up to 2MB
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Grid Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Price */}
            <div>
              <label className="block mb-2 text-sky-700 font-semibold">
                Price Per Product ($)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1000"
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Profit */}
            <div>
              <label className="block mb-2 text-sky-700 font-semibold">
                Profit Per Product ($)
              </label>

              <input
                type="number"
                name="profitPerProduct"
                value={formData.profitPerProduct}
                onChange={handleChange}
                placeholder="10"
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-2 text-sky-700 font-semibold">
                Duration (Days)
              </label>

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Minimum Purchase */}
            <div>
              <label className="block mb-2 text-sky-700 font-semibold">
                Minimum Purchase
              </label>

              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleChange}
                placeholder="1"
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Maximum Purchase */}
            <div>
              <label className="block mb-2 text-sky-700 font-semibold">
                Maximum Purchase
              </label>

              <input
                type="number"
                name="maxPurchase"
                value={formData.maxPurchase}
                onChange={handleChange}
                placeholder="20"
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gradient-to-r from-sky-100 to-sky-50 border border-sky-200 rounded-3xl p-6">
            
            <h2 className="text-2xl font-bold text-sky-700 mb-4">
              Asset Preview
            </h2>

            <div className="space-y-2 text-sky-800">
              <p>
                Product Price:
                <span className="font-bold ml-2">
                  $ {formData.price || 0}
                </span>
              </p>

              <p>
                Profit Per Product:
                <span className="font-bold ml-2">
                  $ {formData.profitPerProduct || 0}
                </span>
              </p>

              <p>
                Duration:
                <span className="font-bold ml-2">
                  {formData.duration || 0} Days
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all py-4 rounded-2xl text-xl font-bold text-white shadow-lg shadow-sky-300"
          >
            {loading
              ? "Creating Asset..."
              : "Create Asset"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateAsset;