import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = ({scrollToFooter}) => {
  return (
    <div className='nav flex items-center justify-between text-sm py-4  mb-5  border-b border-b-gray-400'>    
    <div class="logo-text-container">          
      <img className=' ic cursor-pointer' src='/logo2.jpg' alt=" logo" />
      <div class="text-container">
        <h1 class="app-name">Medicare</h1>
        <p class="tagline">Your Health, Our Priority</p>
    </div>
    </div>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='navigation py 1'>Home</li>
                <hr className='border-none outline-none h-0.5  m-auto' />
            </NavLink>
           
            <NavLink to='/about-us'>
                <li className='navigation py 1'>About Us</li>
                <hr className='border-none outline-none h-0.5 m-auto' />
            </NavLink>
            <NavLink to='/' onClick={scrollToFooter}>
                <li className='navigation py 1'>Contact Us</li>
                <hr className='border-none outline-none h-0.5 m-auto' />
            </NavLink>
        </ul>
        <div>
           
        </div>
    </div>
  )
}

export default Navbar
