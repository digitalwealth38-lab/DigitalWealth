import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
export default function RecentActivities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/recent-activities")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
     <div className="text-center mb-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-lg leading-tight md:leading-snug">
    Recent Activities
  </h2>
  <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
    See the latest actions from your network members. Stay updated with who did what recently.
  </p>
</div>


      {data.map(({ user, activities }) => (
        <div
          key={user._id}
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ fontSize: "1.1rem", color: "#222" }}>
              {user.name}
            </strong>{" "}
            <span style={{ color: "#666" }}>({user.userId})</span>
          </div>

          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", lineHeight: "1.6" }}>
            {activities.map((act) => (
              <li key={act._id} style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#444" }}>{act.description}</span>{" "}
                <small style={{ color: "#999" }}>
                 ({formatDateTime(act.createdAt)})
                </small>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {data.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
          No recent activities found.
        </p>
      )}
    </div>
  );
}
