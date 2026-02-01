import { Link } from "react-scroll";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

export default function Navbaradmin() {
      const {logout} = useAuthStore();
  const linkClasses =
    "text-sm font-semibold cursor-pointer hover:text-blue-100 transition";

  return (
    <nav className="bg-gradient-to-r from-sky-400 to-blue-600 text-white py-4 shadow-md fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo / Title */}
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-md">
            Digital Wealth
          </h1>
        </div>

        {/* Desktop Menu Links */}
 <div className="hidden md:flex items-center gap-6">
        </div>

        {/* Logout Button (Always Visible) */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white text-sky-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-sky-100 transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}