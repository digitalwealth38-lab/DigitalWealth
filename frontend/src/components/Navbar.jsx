import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, LayoutDashboard, Wallet, Package, TrendingUp, ArrowLeftRight, Banknote, Users, Gift, User, Phone } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const navLinks = [
  { path: "/dashboard",  label: "Dashboard",    Icon: LayoutDashboard, color: "bg-blue-50 text-blue-600" },
  { path: "/deposit",    label: "Deposit",       Icon: Wallet,          color: "bg-green-50 text-green-600" },
  { path: "/packages",   label: "Packages",      Icon: Package,         color: "bg-yellow-50 text-yellow-600" },
  { path: "/investment", label: "My Investment", Icon: TrendingUp,      color: "bg-purple-50 text-purple-600" },
  { path: "/transfer",   label: "Transfer",      Icon: ArrowLeftRight,  color: "bg-orange-50 text-orange-600" },
  { path: "/withdrawal", label: "Withdrawal",    Icon: Banknote,        color: "bg-pink-50 text-pink-600" },
  { path: "/referrals",  label: "Referrals",     Icon: Users,           color: "bg-sky-50 text-sky-600" },
  { path: "/rewards",    label: "Rewards",       Icon: Gift,            color: "bg-amber-50 text-amber-600" },
  { path: "/profile",    label: "Profile",       Icon: User,            color: "bg-slate-50 text-slate-600" },
  { path: "/contact",    label: "Contact",       Icon: Phone,           color: "bg-teal-50 text-teal-600" },
];

export default function Navbar() {
  const { logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 shadow-md fixed w-full z-50">
        <div className="container mx-auto flex items-center justify-between px-6">
        
          
          <h1
          
            className="text-2xl flex font-extrabold tracking-wide drop-shadow-md cursor-pointer"
            onClick={() => handleNav("/dashboard")}
          >
            Digital Wealth
          </h1>
          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition cursor-pointer"
            >
              {open ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-[60px] bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      <div className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] w-72 bg-white z-50 shadow-2xl rounded-bl-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Navigation</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navLinks.map(({ path, label, Icon, color }) => (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition
                ${location.pathname === path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${color}`}>
                <Icon size={15} />
              </span>
              {label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => { setOpen(false); logout(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition cursor-pointer"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}