import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from './pages/Homes'
import Doctor from './pages/Doctor'
import Footer from './components/Footer'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Navbar from './components/Navbar'
import Appointment from './components/Appointment'
import './App.css'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
     
     <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment' element={<Appointment />} />
      </Routes>
    <Footer />
    </div>
  )
}

export default App
