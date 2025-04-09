import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
{/*import { GoTools } from 'react-icons/go';*/}

const Home = () => {
  
  
    // State variable to store the chosen role
    const [roleName, setRoleName] = useState('');
    const navigate = useNavigate(); // For navigation
  
    // Function to handle role selection and navigate to the login page
    const gotoLogin = (role) => {
      setRoleName(role);  // Save the selected role in roleName
      navigate(`/login?role=${role}`); //Navigate to login page with role as a query parameter
    };

  return (
    <div className='roles'>
      <p className="About">
      Medicare Hospital has dedicated Centres of Excellence for several key specialties and super specialties. They are unique and state of the art facilities spread across several of the Medicare hospital locations and each Centre of Excellence stands out as a citadel of world class clinical outcomes.

      <br></br>
      <br></br>
      </p>
      <h1>Select Your Role</h1>
       <div className="role-choose ">
        <div className="role-card">
          <img className=' role ' src="/adminnew.jpg" alt="Admin" />
          <button  className="role-btn" onClick={()=>gotoLogin('Admin')} >Admin</button>
        </div>
        <div className="role-card">
          <img className='role 'src="/patientnew.jpg" alt="Patient" />
          <button className="role-btn" onClick={()=>gotoLogin('Patient')}>Patient</button>
        </div>
        <div className="role-card">
          <img className='role 'src="/doctornew.jpg" alt="Doctor" />
          <button className="role-btn" onClick={()=>gotoLogin('Doctor')}>Doctor</button>
        </div>
      </div>
      <p>Selected Role: {roleName}</p>
    </div>
  )
}

export default Home
