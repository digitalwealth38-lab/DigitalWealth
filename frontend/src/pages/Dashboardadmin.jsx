import React, { useEffect } from 'react'
import Navbaradmin from '../components/Navbaradmin'
import { scrollSpy } from "react-scroll";
import DashbaordadminCard from '../components/DashbaordadminCard'
import Packagesadmin from '../components/Packagesadmin';
import AdminWithdrawals from '../components/AdminWithdrawals';
import AdminAddPackage from '../components/AdminAddPackage';
import ProfilePage from '../components/Profile';
import AdminManageUsers from '../components/AdminManageUsers';
import AdminPaymentMethods from '../components/AdminPaymentMethods';
import AdminManualDeposits from '../components/Adminmanualdeposite';
import AdminLocalWithdrawals from '../components/AdminLocalWithdrawals';
import CreatePackage from '../components/CreatePackage';
import EditPackage from '../components/EditPackage';
import AdminWithdrawLimit from '../components/AdminWithdrawLimit';
import AdminTrading from '../components/AdminTrading';

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
<div id="packagesadmin" className="">
  <Packagesadmin/>
  <AdminAddPackage/>
  <EditPackage/>
   <CreatePackage/>
</div>
<div id="adminwithdrawals" className="">
  <AdminWithdrawLimit/>
  <AdminWithdrawals/>
  <AdminLocalWithdrawals/>
</div>
<div id="payment" className="">
  <AdminManualDeposits/>
  <AdminPaymentMethods/>
</div>
<div id="Deposit" className="">
  <AdminTrading/>
</div>
<div id="manageusers" className="">
  <AdminManageUsers/>
</div>
    </div>
  )
}

export default Dashboardadmin
