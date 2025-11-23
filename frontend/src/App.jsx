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

      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={authUser ? <Dashboard /> : <Navigate to="/" />}
      />
      
    </Routes>
         <Toaster/>
    </div>
  )
}

export default App
