import React, { useEffect } from 'react'
import Navbaradmin from '../components/Navbaradmin'
import { scrollSpy } from "react-scroll";
import DashbaordadminCard from '../components/DashbaordadminCard'

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
    </div>
  )
}

export default Dashboardadmin
