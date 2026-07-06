import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import CurrencyToggle from "../components/CurrencyToggle";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <>
      <Navbar />
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

export default MainLayout;