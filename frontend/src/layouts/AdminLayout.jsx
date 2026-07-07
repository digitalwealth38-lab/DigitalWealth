import CurrencyToggle from "../components/CurrencyToggle";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AdminLayout = () => {
  return (
    <>
    <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className="fixed top-24 right-6 z-[9999] cursor-grab active:cursor-grabbing"
      >
        <CurrencyToggle />
      </motion.div>
      <Outlet />
    </>
  );
};

export default AdminLayout;