import { Link } from "react-scroll";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

export default function Navbar() {
      const {logout} = useAuthStore();
  const linkClasses =
    "text-sm font-semibold cursor-pointer hover:text-blue-100 transition";

  return (
    <nav className="bg-gradient-to-r from-sky-400 to-blue-600 text-white py-4 shadow-md fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-10  ">
        {/* Logo / Title */}
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl md:text- font-extrabold tracking-wide drop-shadow-md">
            Digital Wealth
          </h1>
        </div>

        {/* Desktop Menu Links */}
<div className="hidden lg:flex items-center  lg:gap-6">


<Link
  to="dashboard"
  spy={true}
  smooth={true}
  offset={-40} // adjust slightly if needed
  duration={500}
  className={linkClasses}
  activeClass="border-b-2 border-white"
>
  Dashboard
</Link>


          <Link
            to="deposit"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Deposit
          </Link>
          <Link
            to="packages"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Packages
          </Link>
          <Link
            to="referrals"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Referrals
          </Link>
               <Link
            to="transfer"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Transfer
          </Link>
          
             <Link
            to="withdrawal"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Withdrawal
          </Link>
               <Link
            to="Rewards"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Rewards
          </Link>
          <Link
            to="profile"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Profile
          </Link>
            <Link
            to="contact"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Contact
          </Link>
          <Link
            to="team"
            spy={true}
            smooth={true}
            offset={-40}
            duration={500}
            className={linkClasses}
            activeClass="border-b-2 border-white"
          >
            Team
          </Link>
          
        </div>

        {/* Logout Button (Always Visible) */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white text-sky-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-sky-100 transition cursor-pointer"
        >
          <LogOut size={10} />
          Logout
        </button>
      </div>
    </nav>
  );
}






