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
          
          <Route path='/' element={!authUser ? <Home /> : <Navigate to='/dashboard' />} />
          	<Route path='/dashboard' element={ authUser ? <Dashboard /> : <Navigate to='/' />} />
					<Route path='/signup' element={ !authUser ? <Signup /> : <Navigate to='/dashboard' />} />
          	<Route path='/login' element={ !authUser ? <Login /> : <Navigate to='/dashboard' />} />
            <Route path='/forgot-password' element={<ForgotPassword/>} />
            <Route path='/reset-password' element={<ResetPassword/>} />
				</Routes>
         <Toaster/>
    </div>
  )
}

export default App
