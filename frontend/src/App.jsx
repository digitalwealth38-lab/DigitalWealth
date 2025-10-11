import React from 'react'
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <div>
         <Routes>
					
					<Route path='/signup' element={ <Signup />} />
          	<Route path='/login' element={ <Login />} />

				</Routes>
         <Toaster />
    </div>
  )
}

export default App
