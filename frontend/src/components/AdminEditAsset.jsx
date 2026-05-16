import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useAssetStore } from "../stores/assetStore";

const AdminEditAsset = () => {
  const {
    assets,
    getAssets,
    updateAsset,
    deleteAsset,
    loading,
  } = useAssetStore();

  const [editingId, setEditingId] = useState(null);

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

  // =========================
  // Fetch Assets
  // =========================
  useEffect(() => {
    getAssets();
  }, []);

  // =========================
  // Edit
  // =========================
  const handleEdit = (asset) => {
    setEditingId(asset._id);

    setFormData({
      name: asset.name || "",
      image: asset.image || "",
      price: asset.price || "",
      profitPerProduct:
        asset.profitPerProduct || "",
      duration: asset.duration || "",
      minPurchase: asset.minPurchase || "",
      maxPurchase: asset.maxPurchase || "",
    });

    setPreviewImage(asset.image);
  };

  // =========================
  // Change Input
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Image Upload
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error(
        "Image must be less than 2MB"
      );
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

  // =========================
  // Update
  // =========================
  const handleUpdate = async (id) => {
    await updateAsset(id, formData);

    setEditingId(null);
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this asset?"
    );

    if (!confirmDelete) return;

    await deleteAsset(id);
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <h1 className="text-4xl font-black text-center text-sky-700 mb-10">
        Edit Assets
      </h1>

      <div className="max-w-7xl mx-auto overflow-x-auto">
        <table className="min-w-full bg-white rounded-3xl overflow-hidden shadow-xl">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Profit</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Min</th>
              <th className="p-4">Max</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-8 text-gray-500"
                >
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset._id}
                  className="border-b hover:bg-sky-50 text-center"
                >
                  {/* IMAGE */}
              <td className="p-3">
  {editingId === asset._id ? (
    <div className="flex flex-col items-center gap-3">
      
      <img
        src={previewImage}
        alt=""
        className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-100 shadow-md"
      />

      <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow">
        Change Image

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </label>
    </div>
  ) : (
    <img
      src={asset.image}
      alt=""
      className="w-16 h-16 rounded-2xl object-cover mx-auto border border-slate-100"
    />
  )}
</td>

                  {/* NAME */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded-xl p-2"
                      />
                    ) : (
                      asset.name
                    )}
                  </td>

                  {/* PRICE */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border rounded-xl p-2 w-24"
                      />
                    ) : (
                      `$${asset.price}`
                    )}
                  </td>

                  {/* PROFIT */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="number"
                        name="profitPerProduct"
                        value={
                          formData.profitPerProduct
                        }
                        onChange={handleChange}
                        className="border rounded-xl p-2 w-24"
                      />
                    ) : (
                      `$${asset.profitPerProduct}`
                    )}
                  </td>

                  {/* DURATION */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="border rounded-xl p-2 w-20"
                      />
                    ) : (
                      `${asset.duration} Days`
                    )}
                  </td>

                  {/* MIN */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="number"
                        name="minPurchase"
                        value={formData.minPurchase}
                        onChange={handleChange}
                        className="border rounded-xl p-2 w-20"
                      />
                    ) : (
                      asset.minPurchase
                    )}
                  </td>

                  {/* MAX */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <input
                        type="number"
                        name="maxPurchase"
                        value={formData.maxPurchase}
                        onChange={handleChange}
                        className="border rounded-xl p-2 w-20"
                      />
                    ) : (
                      asset.maxPurchase
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {editingId === asset._id ? (
                      <button
                        onClick={() =>
                          handleUpdate(asset._id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                      >
                        Save
                      </button>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleEdit(asset)
                          }
                          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(asset._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
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

export default AdminEditAsset;