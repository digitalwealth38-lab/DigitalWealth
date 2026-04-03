import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Trash2, Edit, Plus, Upload, X } from "lucide-react";

const AdminPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    method: "",
    accountName: "",
    accountNumber: "",
  });

  const uploadQR = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setQrImage(reader.result);
    reader.readAsDataURL(file);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const loadMethods = async () => {
    try {
      const res = await axiosInstance.get("/payment-methods");
      setMethods(res.data);
    } catch (err) {
      showToast("Failed to fetch methods", "error");
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingMethod(null);
    setForm({ method: "", accountName: "", accountNumber: "" });
    setQrImage("");
  };

  const saveMethod = async () => {
    if (!form.method || !form.accountName || !form.accountNumber) {
      showToast("Method, Account Name and Account Number are required!", "error");
      return;
    }

    try {
      const payload = {
        method: form.method,
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        ...(qrImage && { qrCode: qrImage }),
      };

      if (editingMethod) {
        await axiosInstance.put(`/payment-methods/${editingMethod}`, payload);
        showToast("Method updated!");
      } else {
        await axiosInstance.post("/payment-methods/create", payload);
        showToast("Method created!");
      }

      resetForm();
      loadMethods();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    }
  };

  const deleteMethod = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    try {
      await axiosInstance.delete(`/payment-methods/${id}`);
      showToast("Method deleted!");
      loadMethods();
    } catch (err) {
      showToast("Failed to delete method", "error");
    }
  };

  const editMethod = (method) => {
    setForm({
      method: method.method,
      accountName: method.accountName,
      accountNumber: method.accountNumber,
    });
    setEditingMethod(method._id);
    setQrImage(method.qrCode || "");
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6">

      {/* Toast */}
      {toast.message && (
        <div className={`fixed top-5 right-5 px-5 py-3 rounded-xl text-white shadow-lg z-50 font-semibold ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-sky-700">Payment Methods</h2>
          <p className="text-sm text-gray-400 mt-1">Manage deposit & withdrawal methods</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
        >
          <Plus size={18} /> Add Method
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-sky-700">
                {editingMethod ? "Edit Method" : "Add New Method"}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {/* Method Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Method Name *</label>
                <input
                  type="text"
                  placeholder="e.g. JazzCash, EasyPaisa"
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Account Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Account Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 03001234567"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
                />
              </div>

              {/* QR Upload — optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  QR Code <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3 border border-sky-200 rounded-xl p-3 bg-sky-50 cursor-pointer">
                  <Upload size={20} className="text-sky-500 shrink-0" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadQR}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer"
                  />
                </div>
                {qrImage && (
                  <div className="relative mt-3 w-fit mx-auto">
                    <img src={qrImage} alt="QR Preview" className="w-36 h-36 rounded-xl object-cover shadow border" />
                    <button
                      onClick={() => setQrImage("")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={saveMethod}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl font-semibold transition"
                >
                  {editingMethod ? "Update Method" : "Create Method"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Methods Grid */}
      {methods.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-lg font-medium">No payment methods yet</p>
          <p className="text-sm mt-1">Click "Add Method" to create one</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {methods.map((m) => (
            <div key={m._id} className="flex flex-col justify-between p-5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all">

              {/* Info */}
              <div className="space-y-1.5">
                <p className="text-lg font-bold text-sky-700">{m.method}</p>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p><span className="font-semibold">Name:</span> {m.accountName}</p>
                  <p><span className="font-semibold">Number:</span> {m.accountNumber}</p>
                </div>
              </div>

              {/* QR */}
              {m.qrCode && (
                <img src={m.qrCode} alt={`${m.method} QR`} className="w-28 h-28 mt-4 rounded-xl object-cover mx-auto shadow border" />
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => editMethod(m)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold transition"
                >
                  <Edit size={15} /> Edit
                </button>
                <button
                  onClick={() => deleteMethod(m._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentMethods;