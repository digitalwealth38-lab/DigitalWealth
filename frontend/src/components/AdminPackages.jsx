import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import AdminPackageCard from "./AdminPackageCard";
import { Link } from "react-router-dom";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    const res = await axiosInstance.get("/investment/packages");
    setPackages(res.data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Investment Packages</h1>

        <Link
          to="/admin/create-package"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create Package
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <AdminPackageCard
            key={pkg._id}
            pkg={pkg}
            refresh={fetchPackages}
          />
        ))}
      </div>
    </div>
  );
}
