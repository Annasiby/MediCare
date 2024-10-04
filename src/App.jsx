import React from 'react'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Doctor from './pages/Doctor'
import Patient from './pages/Patient'
//import Admin from './pages/Admin'
import Aboutus from './pages/Aboutus'
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
        <Route path='/footer' element={<Footer />} />   
        <Route path='/about-us' element={<Aboutus />} />
        
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/patient' element={<Patient />} /> 
        {/*<Route path='/admin' element={<Admin />} />*/}
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
