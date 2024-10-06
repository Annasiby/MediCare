import React from 'react'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Doctor from './pages/Doctor'
import Patient from './pages/Patient'
import Admin from './pages/Admin'
import Aboutus from './pages/Aboutus'
import Footer from './components/Footer'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import Appointment from './pages/Appointment'
import './App.css'
import Register from './pages/register'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
     
     <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/footer' element={<Footer />} />   
        <Route path='/about-us' element={<Aboutus />} />
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/doctor/:speciality' element={<Doctor />} />
        <Route path='/patient' element={<Patient />} /> 
        <Route path='/admin' element={<Admin />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    <Footer />
    </div>
  )
}

export default App
