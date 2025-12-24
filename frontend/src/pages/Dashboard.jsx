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
import ProgressRewards from "../components/ProgressRewards";
import Tree from "../components/Tree";
import TransferUsers from "../components/Transferuser";
import TransferHistory from "../components/TransferHistory";
import UserDepositPage from "../components/UserDepositPage";
import LocalWithdrawal from "../components/LocalWithdrawal";
import DepositSwitcher from "../components/DepositSwitcher";
import WithdrawSwitcher from "../components/WithdrawSwitcher";
import TransferSwitcher from "../components/TransferSwitcher";
import InvestPackages from "../components/Investmentpkg";
import MyInvestments from "../components/MyInvestments";
import PackagesSwitcher from "../components/PackagesSwitcher";
import UnactiveMembers from "../components/UnactiveMembers";
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
    <DepositSwitcher/>
    {/* Your deposit content here */}
  </div>

  {/* Packages Section */}
  <div id="packages" className="min-h-screen">
    <PackagesSwitcher/>
  </div>
   <div id="investment" className="min-h-screen">
    <MyInvestments/>
  </div>

  {/* Referrals Section */}
  
   <div id="transfer" className="min-h-screen">
   <TransferSwitcher/>
  </div>
  <div id="withdrawal" className="min-h-screen">
   <WithdrawSwitcher/>
    {/* Your referrals content here */}
  </div>
    <div id="Rewards" className="min-h-screen">
      <ProgressRewards/>
    {/* Your referrals content here */}
  </div>
  {/* Settings Section */}
  <div id="profile" className="min-h-screen">
    <Profile/>
  </div>
  
    <div id="contact" className="min-h-screen">
      <Contact/>
  </div>
  <div id="referrals" className="min-h-screen">
   <Referral/>
    <Tree/>
      <UnactiveMembers/>
  </div> 
</div>
    </div>
  );
}


