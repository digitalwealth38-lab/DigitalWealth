import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { useEffect } from "react";
import { scrollSpy } from "react-scroll";
import Deposit from "../components/Deposit";
import Profile from "../components/Profile";
import Withdrawal from "../components/Withdrawal";
export default function Dashboard() {
   useEffect(() => {
    scrollSpy.update();   // 🔑 tells react-scroll to mark current section
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Navbar />
   <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
  <Navbar onLogout={() => console.log("Logout")} />

  {/* Dashboard Section */}
<div id="dashboard" className="">
  <DashboardCard />
</div>


  {/* Deposit Section */}
  <div id="deposit" className="min-h-screen">
    <Deposit/>
    {/* Your deposit content here */}
  </div>

  {/* Packages Section */}
  <div id="packages" className="min-h-screen">
    <h2 className="text-3xl font-bold text-center mt-20">Packages Section</h2>
    {/* Your packages content here */}
  </div>

  {/* Referrals Section */}
  <div id="referrals" className="min-h-screen">
    <h2 className="text-3xl font-bold text-center mt-20">Referrals Section</h2>
    {/* Your referrals content here */}
  </div>

  <div id="withdrawal" className="min-h-screen">
    <Withdrawal/>
    {/* Your referrals content here */}
  </div>
  {/* Settings Section */}
  <div id="profile" className="min-h-screen">
    <Profile/>
    {/* Your settings content here */}
  </div>
</div>
    </div>
  );
}


