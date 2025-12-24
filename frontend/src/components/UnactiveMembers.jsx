import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const UnactiveMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/users/unactive-members"); 
        console.log(res.data)
        setMembers(res.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading unactive members...
      </div>
    );
  }

  if (members.length === 0) {
    return (
    <div className="flex justify-center items-center min-h-[200px] md:h-64 px-4">
  <h1 className="text-3xl font-bold text-gray-500 text-center">
    No Unactive Referred Member Found.
  </h1>
</div>

    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent 
               bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 drop-shadow-md mb-8">
  Unactive Referred Members
</h2>


      <div className="overflow-y-auto max-h-80"> {/* Scrollable container */}
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10 border-b">
            <tr>
              <th className="py-2 px-4 text-gray-600">#</th>
              <th className="py-2 px-4 text-gray-600">Name</th>
              <th className="py-2 px-4 text-gray-600">Email</th>
              <th className="py-2 px-4 text-gray-600">Referral Code</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={member._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{member.name}</td>
                <td className="py-2 px-4">{member.email}</td>
                <td className="py-2 px-4">{member.referralCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnactiveMembers;

