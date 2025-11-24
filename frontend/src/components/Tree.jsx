import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const Tree = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const { data } = await axiosInstance.get("/users/team");
        console.log("📊 Hierarchy Data:", data);
        setHierarchy(data.hierarchy);
      } catch (error) {
        console.error("❌ Error fetching hierarchy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHierarchy();
  }, []);

  if (loading) return <p>Loading referral tree...</p>;
if (!hierarchy || hierarchy.length === 0) {
  return (
    <div className="flex justify-center items-center h-64">
      <h1 className="text-3xl font-bold text-gray-500">
        You have no team yet 👥
      </h1>
    </div>
  );
}


  const { level1Members = [], level2Members = [], level3Members = [] } =
    hierarchy;

  return (
    <div className="tree-wrapper">
    <h1 className="text-4xl md:text-5xl font-extrabold text-center text-sky-600 mb-10 drop-shadow-lg">
        My Team
      </h1>

      <div className="tree-container">
        {/* Root user */}
        <div className="tree-level ">
          <div className="member-box root">
            <div className="icon">👑</div>
            <div className="name">You</div>
          </div>
        </div>

        {/* Level 1 */}
        {level1Members.length > 0 && (
          <>
         <h1 className="text-2xl font-bold text-sky-500 tracking-wide">Direct Referral</h1>

            <div className="tree-line"></div>
            <div className="tree-level">
              {level1Members.map((member) => (
                <div className="member-box" key={member._id}>
                  <div className="icon">👤</div>
                  <div className="name">{member.name}</div>
                  <div className="id">Id: {member.userId}</div>
                  <div className="level">Referral: Direct Referral</div>
                   <div className="id">Referredby: {member.referredBy}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Level 2 */}
        {level2Members.length > 0 && (
          <>
              <h1 className="text-2xl font-bold text-sky-500 tracking-wide">Second Referral</h1>
            <div className="tree-line"></div>
            <div className="tree-level">
              {level2Members.map((member) => (
                <div className="member-box" key={member._id}>
                  <div className="icon">👤</div>
                  <div className="name">{member.name}</div>
                  <div className="id">Id: {member.userId}</div>
                  <div className="level">Referral: Second Referral</div>
                    <div className="id">Referredby: {member.referredBy}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Level 3 */}
        {level3Members.length > 0 && (
          <>    <h1 className="text-2xl font-bold text-sky-500 tracking-wide">Third Referral</h1>
            <div className="tree-line"></div>
            <div className="tree-level">
              {level3Members.map((member) => (
                <div className="member-box" key={member._id}>
                  <div className="icon">👤</div>
                  <div className="name">{member.name}</div>
                  <div className="id">Id: {member.userId}</div>
                  <div className="level">Referral: Third Referral</div>
                    <div className="id">Referredby: {member.referredBy}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tree;










