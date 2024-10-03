import React from 'react'

const Home = () => {
  return (
    <div className='roles '>
      <p className="About">
      Our Hospital Management System is designed to streamline hospital operations and enhance patient care. With advanced features like patient management, doctor scheduling, billing, and real-time data access, we aim to simplify healthcare processes for hospitals, clinics, and medical centers. Our platform prioritizes efficiency, security, and a seamless experience for both healthcare providers and patients. 
      <br></br>
      </p>
      <h1>Choose your role</h1>
       <div className="role-choose ">
        <div className="role-card">
          <img className=' role cursor-pointer' src="/admin.png" alt="Admin" />
          <button className="role-btn">Admin</button>
        </div>
        <div className="role-card">
          <img className='role  cursor-pointer'src="/patient.png" alt="Patient" />
          <button className="role-btn">Patient</button>
        </div>
        <div className="role-card">
          <img className='role  cursor-pointer'src="/doctor.png" alt="Doctor" />
          <button className="role-btn">Doctor</button>
        </div>
      </div>
    </div>
  )
}

export default Home
