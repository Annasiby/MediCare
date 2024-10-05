import React, { useEffect, useState } from 'react'
import { useLocation,useNavigate} from 'react-router-dom';

// Helper function to get query parameters
const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};
const Login = () => {
  
  const [role, setRole] = useState('');
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [error, setError] = useState(null); // Error state to handle errors

  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Get the 'role' query parameter when the component loads
    const roleFromQuery = queryParams.get('role');
    setRole(roleFromQuery); // Set the role based on the query parameter
  }, [location.search]);
 // Empty dependency array ensures it only runs on component mount
    
  //Handle form submission based on role*/}
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission
   
  // Prepare data to send to the API
      const formData = {
        username: username,
        password: password,
        role: role, // Include role in the submission
      };
    
    let apiUrl = '';
    if(role){
      if (role === 'admin') {
        apiUrl = '/api/admin/login';
      } else if (role === 'doctor') {
        apiUrl = '/api/doctor/login';
      } else if (role === 'patient') {
        apiUrl = '/api/patient/login';
      }

  // Prepare the payload for the fetch request
    //const payload = { username, password };

      fetch(apiUrl, {
        method: 'POST',  // or 'GET', 'PUT', etc.
        headers: {
          'Content-Type': 'application/json'// Set content type
        },
        body: JSON.stringify(formData) // Convert your data to a JSON string
      })
      .then(response => {
        // Check for a successful response
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Handle non-200 responses
        
        }
        return response.json();
      })
      .then(data => {
        //handle successful login
        console.log('Login successful:', data); // Handle the response data
        alert('Login successful: ' + data.message);
      // Redirect to dashboard or home page based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (role === 'patient') {
        navigate('/patient/dashboard');
      }
      })
      .catch(error => {
        //handle errors
        setError(error.message); // Set error message to state
        console.error('There was a problem with the fetch operation:', error); // Log error
      });
    
    }else {
    // If no role is found in the URL, redirect back to the role selection page
    alert('No role selected. Redirecting to role selection.');
    navigate('/');
  }
};
    return (
      
    <div className="login-container">
      <h2 className="form-title">Login Page</h2>
      <h3>{role ? `Login as ${role}` : 'Login'}</h3>
    {/*<div className="social-login">
      <button className="social-button">
        <img src="google.png" alt="Google" className="social-icon" />
      Google
      </button>
      <button className="social-button">
        <img src="apple.png" alt="Apple" className="social-icon" />
        Apple
      </button>
    </div>
    <p className="seperator"><span >or</span></p>
    */}
    <form onSubmit={handleSubmit} className="login form">
      <div className="inputs">
        <input type="email" 
        placeholder="Email address" 
        value ={username} 
        className="input-wrapper" 
        onChange={(e) => setUsername(e.target.value)} // Update username
        required/>
        <img src="email.png" alt="Email" className="social-button"/>
      </div>

      <div className="inputs">
        <input type="password" 
        placeholder="Password" 
        className="input-wrapper" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Update password
        required/>
        <img src="lock.png" alt="Lock" className="social-button"/>
      </div>
    <button type="submit" className="login-button" >
      {role === 'Patient' ? 'Sign Up' : 'Login'} {/* Change button text based on role */}
    </button>
    <br></br>
    <a href="#" className="forgot-password-link">Forgot Password?</a>
    </form>
    
    <p className="signup-text">New Patient? <a href="/register">Register now</a></p>
    
  </div>
  )
}

export default Login
