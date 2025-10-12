import React, { useEffect } from 'react'
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import Dashboard from './pages/Dashboard.jsx'
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
          	<Route path='/' element={ authUser ? <Dashboard /> : <Navigate to='/login' />} />
					<Route path='/signup' element={ !authUser ? <Signup /> : <Navigate to='/' />} />
          	<Route path='/login' element={ !authUser ? <Login /> : <Navigate to='/' />} />
          

				</Routes>
         <Toaster />
    </div>
  )
}

export default App
