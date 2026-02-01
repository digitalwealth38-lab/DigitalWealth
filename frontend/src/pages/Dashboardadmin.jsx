import React, { useEffect } from 'react'
import Navbaradmin from '../components/Navbaradmin'
import { scrollSpy } from "react-scroll";
import DashbaordadminCard from '../components/DashbaordadminCard'
import AdminManageUsers from '../components/AdminManageUsers';


const Dashboardadmin = () => {
      useEffect(() => {
        scrollSpy.update();   // 🔑 tells react-scroll to mark current section
      }, []);
  return (

    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
<Navbaradmin/>
<div id="dashboardadmin" className="">
  <DashbaordadminCard/>
</div>
<div id="manageusers" className="">
  <AdminManageUsers/>
  
</div>
    </div>
  )
}

export default Dashboardadmin
