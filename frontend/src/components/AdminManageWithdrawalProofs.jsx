import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Edit, Trash2, Upload, X, Save, User, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminManageWithdrawalProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ username: "", image: "" });
  const [preview, setPreview] = useState("");

  const fetchProofs = async () => {
    try {
      const res = await axiosInstance.get("/WithdrawalProofs");
      setProofs(res.data.proofs || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchProofs(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be less than 2MB");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
  };

  const handleEdit = (proof) => {
    setEditId(proof._id);
    setFormData({ username: proof.username, image: proof.image });
    setPreview(proof.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    if (!formData.username || !formData.image) return toast.error("Please fill all fields");
    try {
      setLoading(true);
      const res = await axiosInstance.put(`admin/update/${editId}`, formData);
      toast.success(res.data.message || "Updated successfully");
      setEditId(null);
      fetchProofs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this proof? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`admin/delete/${id}`);
      toast.success("Deleted successfully");
      fetchProofs();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Withdrawal Proofs</h1>
          <p className="text-slate-500">Manage and verify user withdrawal records</p>
        </div>

        <AnimatePresence>
          {editId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Edit Proof Details</h2>
                <button onClick={() => setEditId(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof</label>
                  <label className="h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 transition bg-slate-50">
                    {preview ? <img src={preview} className="w-full h-full object-cover rounded-lg" /> : (
                      <div className="text-center text-slate-400"><Upload size={24} className="mx-auto mb-1" /><span className="text-xs">Browse Image</span></div>
                    )}
                    <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <button disabled={loading} onClick={handleUpdate} className="mt-8 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]">
                <Save size={18} /> {loading ? "Processing..." : "Save Changes"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofs.length > 0 ? proofs.map((proof) => (
            <div key={proof._id} className="bg-white group rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img src={proof.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="proof" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-sky-50 p-2 rounded-lg text-sky-600"><User size={16} /></div>
                  <span className="font-semibold text-slate-700 truncate">{proof.username}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(proof)} className="flex-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(proof._id)} className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p>No withdrawal proofs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageWithdrawalProofs;