import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Upload, BadgeDollarSign, User, Image as ImageIcon } from "lucide-react";

const AdminWithdrawalProofs = () => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({ username: "", image: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be less than 2MB");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.image) return toast.error("Please upload an image");

    try {
      setLoading(true);
      const res = await axiosInstance.post("admin/withdrawalproof", formData);
      toast.success(res.data.message || "Withdrawal proof created successfully");
      setFormData({ username: "", image: "" });
      setPreviewImage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white border border-sky-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-sky-500/5">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-sky-100 p-4 rounded-2xl text-sky-600">
            <BadgeDollarSign size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Withdrawal Proof</h1>
            <p className="text-slate-500 text-sm md:text-base">Upload successful withdrawal screenshots</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter member username"
                className="w-full pl-12 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Withdrawal Screenshot</label>
            <label className="group relative w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 hover:border-sky-400 hover:bg-sky-50 transition-all">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-sky-600">
                  <div className="bg-white p-4 rounded-full shadow-sm"><Upload size={24} /></div>
                  <span className="text-sm font-medium">Click to upload or drag and drop</span>
                  <span className="text-xs opacity-70">PNG, JPG, WEBP (Max 2MB)</span>
                </div>
              )}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {previewImage ? (
                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <ImageIcon className="text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Username</p>
              <h3 className="text-xl font-bold text-slate-800">{formData.username || "Waiting for input..."}</h3>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-lg shadow-sky-200 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Create Withdrawal Proof"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminWithdrawalProofs;