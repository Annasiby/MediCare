import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav flex items-center justify-between text-sm py-4  mb-5  border-b border-b-gray-400'>              
      <img className=' ic cursor-pointer' src='/logo.png' alt=" logo" />
      <h1 className='Name'>Hospital Management</h1>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='navigation py 1'>Home</li>
                <hr className='border-none outline-none h-0.5  m-auto' />
            </NavLink>
           
            <NavLink to='/about-us'>
                <li className='navigation py 1'>About Us</li>
                <hr className='border-none outline-none h-0.5 m-auto' />
            </NavLink>
            <NavLink>
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
