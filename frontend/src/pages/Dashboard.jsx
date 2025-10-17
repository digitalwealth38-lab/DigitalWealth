import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { useEffect } from "react";
import { scrollSpy } from "react-scroll";
import Deposit from "../components/Deposit";
import Profile from "../components/Profile";
import Withdrawal from "../components/Withdrawal";
import Contact from "../components/Contact";
import Referral from "../components/Referral";
import Packages from "../components/Packages";
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
    <Packages/>
  </div>

  {/* Referrals Section */}
  <div id="referrals" className="min-h-screen">
   <Referral/>
  </div>

  <div id="withdrawal" className="min-h-screen">
    <Withdrawal/>
    {/* Your referrals content here */}
  </div>
  {/* Settings Section */}
  <div id="profile" className="min-h-screen">
    <Profile/>
  </div>
  
    <div id="contact" className="min-h-screen">
      <Contact/>
  </div>
</div>
    </div>
  );
}


