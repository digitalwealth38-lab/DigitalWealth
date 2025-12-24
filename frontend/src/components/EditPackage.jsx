import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const EditPackage = () => {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch packages (SAFE)
  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("/packages/investpackages", {
        withCredentials: true,
      });

      console.log("API RESPONSE 👉", res.data);

      // 🔐 SAFETY: always force array
      if (Array.isArray(res.data?.packages)) {
        setPackages(res.data.packages);
      } else if (Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load investment packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ✏️ Edit
  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      name: pkg.name || "",
      investmentAmount: pkg.investmentAmount || "",
      durationDays: pkg.durationDays || "",
      returnType: pkg.returnType || "DAILY",
      return: pkg.return || "",
      packageExpiresAt: pkg.packageExpiresAt
        ? pkg.packageExpiresAt.slice(0, 10)
        : "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 💾 Update
  const handleUpdate = async (id) => {
    try {
      await axiosInstance.put(
        `/admin/investpackage/${id}`,
        {
          name: formData.name,
          investmentAmount: Number(formData.investmentAmount),
          durationDays: Number(formData.durationDays),
          returnType: formData.returnType,
          Return: Number(formData.return),
          packageExpiresAt: formData.packageExpiresAt,
        },
        { withCredentials: true }
      );

      toast.success("Package updated successfully");
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await axiosInstance.delete(`/admin/investpackage/${id}`, {
        withCredentials: true,
      });
      toast.success("Package deleted");
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sky-700 text-xl font-semibold">
        Loading investment packages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
        Admin – Manage Investment Packages
      </h2>

      <div className="max-w-7xl mx-auto overflow-x-auto">
        <table className="min-w-full bg-white shadow-xl rounded-xl overflow-hidden">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Return Type</th>
              <th className="p-3">Return</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No investment packages found
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr
                  key={pkg._id}
                  className="border-b hover:bg-sky-50 text-center"
                >
                  {/* NAME */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      pkg.name
                    )}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <input
                        type="number"
                        name="investmentAmount"
                        value={formData.investmentAmount}
                        onChange={handleChange}
                        className="border rounded p-1 w-24"
                      />
                    ) : (
                      `$${pkg.investmentAmount}`
                    )}
                  </td>

                  {/* DURATION */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <input
                        type="number"
                        name="durationDays"
                        value={formData.durationDays}
                        onChange={handleChange}
                        className="border rounded p-1 w-20"
                      />
                    ) : (
                      `${pkg.durationDays} days`
                    )}
                  </td>

                  {/* RETURN TYPE */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <select
                        name="returnType"
                        value={formData.returnType}
                        onChange={handleChange}
                        className="border rounded p-1"
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                      </select>
                    ) : (
                      pkg.returnType
                    )}
                  </td>

                  {/* RETURN */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <input
                        type="number"
                        name="return"
                        value={formData.return}
                        onChange={handleChange}
                        className="border rounded p-1 w-20"
                      />
                    ) : (
                      `$${pkg.return}`
                    )}
                  </td>

                  {/* EXPIRY */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <input
                        type="date"
                        name="packageExpiresAt"
                        value={formData.packageExpiresAt}
                        onChange={handleChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      pkg.packageExpiresAt
                        ? new Date(pkg.packageExpiresAt).toLocaleDateString()
                        : "—"
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {editingId === pkg._id ? (
                      <button
                        onClick={() => handleUpdate(pkg._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditPackage;
