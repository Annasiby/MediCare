import React, { useRef } from 'react'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Doctor from './pages/Doctor'
import Patient from './pages/Patient'
import Admin from './pages/Admin'
import Aboutus from './pages/Aboutus'
import Footer from './components/Footer'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import './App.css'
import Register from './pages/register'

// Wrap Footer with forwardRef to accept the ref in Footer.jsx


const App = () => {
  const footerRef = useRef(null); // Create a reference to the footer
  
  // Scroll to the footer smoothly
  const scrollToFooter = (event) => { 
    event.preventDefault(); // Prevent the default anchor behavior
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='mx-4 sm:mx-[10%]'>
     
      {/* Pass the scrollToFooter function to the Navbar */}
      <Navbar scrollToFooter={scrollToFooter} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/footer' element={<Footer />} />   
        <Route path='/about-us' element={<Aboutus />} />
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/patient' element={<Patient />} /> 
        <Route path='/admin' element={<Admin />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer ref={footerRef} /> 
        
    </div>
  )
}

export default App;
