import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Trash2, Edit, Plus } from "lucide-react";

const AdminPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    method: "",
    accountName: "",
    accountNumber: "",
  });

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Fetch all methods
  const loadMethods = async () => {
    try {
      const res = await axiosInstance.get("/payment-methods");
      setMethods(res.data);
    } catch (err) {
      showToast("Failed to fetch methods", "error");
      console.error(err);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  // Handle Create or Update
  const saveMethod = async () => {
    if (!form.method || !form.accountName || !form.accountNumber) {
      showToast("All fields required!", "error");
      return;
    }

    try {
      if (editingMethod) {
        await axiosInstance.put(`/payment-methods/${editingMethod}`, form);
        showToast("Method updated!");
      } else {
        await axiosInstance.post("/payment-methods/create", form);
        showToast("Method created!");
      }

      setShowForm(false);
      setEditingMethod(null);
      setForm({ method: "", accountName: "", accountNumber: "" });
      loadMethods();
    } catch (err) {
      showToast("Something went wrong!", "error");
      console.error(err);
    }
  };

  // Delete Method with OK/Cancel
  const deleteMethod = async (id) => {
    {
      try {
        await axiosInstance.delete(`/payment-methods/${id}`);
        showToast("Method deleted!");
        loadMethods();
      } catch (err) {
        showToast("Failed to delete method", "error");
        console.error(err);
      }
    }
  };

  // Edit Method
  const editMethod = (method) => {
    setForm(method);
    setEditingMethod(method._id);
    setShowForm(true);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md border">
      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-md text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-700">Manage Payment Methods</h2>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingMethod(null);
            setForm({ method: "", accountName: "", accountNumber: "" });
          }}
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
        >
          <Plus size={20} /> Add Method
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-3">
            {editingMethod ? "Edit Method" : "Create Method"}
          </h3>

          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Method Name (JazzCash, EasyPaisa)"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="border p-3 rounded-md w-full"
            />

            <input
              type="text"
              placeholder="Account Name"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              className="border p-3 rounded-md w-full"
            />

            <input
              type="text"
              placeholder="Account Number"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="border p-3 rounded-md w-full"
            />

            <button
              onClick={saveMethod}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
            >
              {editingMethod ? "Update Method" : "Create Method"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="text-red-500 hover:underline mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Methods List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">All Methods</h3>

        <div className="space-y-4">
          {methods.map((m) => (
            <div
              key={m._id}
              className="flex justify-between items-center p-4 border rounded-lg bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-lg font-semibold">{m.method}</p>
                  <p className="text-gray-700 text-sm">{m.accountName}</p>
                  <p className="text-gray-700 text-sm">{m.accountNumber}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editMethod(m)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={22} />
                </button>

                <button
                  onClick={() => deleteMethod(m._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentMethods;
