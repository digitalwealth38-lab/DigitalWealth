import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
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
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    scrollSpy.update();
    axiosInstance.get("/notifications")
      .then(res => setNotifications(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">

      {/* Sticky Navbar */}
      <Navbar />

      {/* Notification Banners — rendered right after navbar in normal flow */}
      <div style={{ position: 'sticky', top: 64, zIndex: 49 }}>
        {notifications
          .filter(n => !dismissed.includes(n._id))
          .map(n => (
            <div key={n._id} style={{
              background: n.bgColor || '#eff6ff',
              borderLeft: `4px solid ${n.borderColor || '#3b82f6'}`,
              color: n.textColor || '#1d4ed8',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 14 }}>
                {n.icon} <strong>{n.title}:</strong> {n.message}
                {n.link && (
                  <a href={n.link} style={{ marginLeft: 10, textDecoration: 'underline', fontWeight: 600 }}>
                    {n.linkText || 'Learn More'}
                  </a>
                )}
              </span>
              <button
                onClick={() => setDismissed(p => [...p, n._id])}
                style={{
                  background: 'none', border: 'none', fontSize: 18,
                  cursor: 'pointer', color: n.textColor || '#1d4ed8', marginLeft: 16
                }}>
                ✕
              </button>
            </div>
          ))}
      </div>

      {/* Dashboard Section */}
      <div id="dashboard">
        <DashboardCard />
      </div>

      {/* Deposit Section */}
      <div id="deposit" className="min-h-screen">
        <DepositSwitcher />
      </div>

      {/* Packages Section */}
      <div id="packages" className="min-h-screen">
        <PackagesSwitcher />
      </div>

      <div id="investment" className="min-h-screen">
        <MyInvestments />
      </div>

      <div id="transfer" className="min-h-screen">
        <TransferSwitcher />
      </div>

      <div id="withdrawal" className="min-h-screen">
        <WithdrawSwitcher />
      </div>

      <div id="referrals" className="min-h-screen">
        <Referral />
        <Tree />
        <UnactiveMembers />
      </div>

      <div id="Rewards" className="min-h-screen">
        <ProgressRewards />
      </div>

      <div id="profile" className="min-h-screen">
        <Profile />
      </div>

      <div id="contact" className="min-h-screen">
        <Contact />
      </div>

    </div>
  );
}