import React, { useEffect, useState } from 'react'
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login'
import toast, { Toaster } from 'react-hot-toast'
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import Dashboard from './pages/Dashboard.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Home from"./pages/Home.jsx"
import Dashboardadmin from './pages/Dashboardadmin.jsx'
import BlockedUser from './components/BlockedUser.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import DepositSwitcher from './components/DepositSwitcher.jsx'
import Navbar from './components/Navbar.jsx'
import PackagesSwitcher from './components/PackagesSwitcher.jsx'
import MyInvestments from './components/MyInvestments.jsx'
import TransferSwitcher from './components/TransferSwitcher.jsx'
import WithdrawSwitcher from './components/WithdrawSwitcher.jsx'
import Referral from './components/Referral.jsx'
import ProgressRewards from './components/ProgressRewards.jsx'
import Profile from "./components/Profile";
import Contact from './components/Contact.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'

const App = () => {

const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // 🔹 Show loader during check or before user is set
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div>
       <Routes>
        
      {/* Public Routes */}
        <Route element={<AuthLayout />}>
      <Route
        path="/"
        element={
          !authUser ? (
            <Home />
          ) : authUser?.isAdmin ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !authUser ? (
            <Signup />
          ) : authUser?.isAdmin ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/login"
        element={
          !authUser ? (
            <Login />
          ) : authUser?.isAdmin ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          authUser?.isAdmin ? (
            <Dashboardadmin />
          ) : authUser ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/" />
          )
        }
      />
<Route
  path="/blocked"
  element={<BlockedUser />}
/>

<Route
  path="/verify-otp"
  element={
    !authUser ? <VerifyOTP /> : authUser?.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
  }
/>
</Route>
 <Route element={<MainLayout />}>
      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={authUser ? <Dashboard /> : <Navigate to="/" />}
      />
        <Route
        path="/deposit"
        element={authUser ? <DepositSwitcher /> : <Navigate to="/" />}
      />
       <Route
        path="/packages"
        element={authUser ? <PackagesSwitcher/> : <Navigate to="/" />}
      />
       <Route
        path="/investment"
        element={authUser ? <MyInvestments />: <Navigate to="/" />}
      />
      <Route
        path="/transfer"
        element={authUser ? <TransferSwitcher />: <Navigate to="/" />}
      />
      <Route
        path="/withdrawal"
        element={authUser ? <WithdrawSwitcher />: <Navigate to="/" />}
      />
         <Route
        path="/referrals"
        element={authUser ? <Referral /> : <Navigate to="/" />}
      />
       <Route
        path="/rewards"
        element={authUser ? <ProgressRewards />: <Navigate to="/" />}
      />
       <Route
        path="/profile"
        element={authUser ? <Profile/> : <Navigate to="/" />}
      />
        <Route
        path="/contact"
        element={authUser ?   <Contact />: <Navigate to="/" />}
      />
  </Route>
    </Routes>
         <Toaster/>
    </div>
  )
}

export default App
