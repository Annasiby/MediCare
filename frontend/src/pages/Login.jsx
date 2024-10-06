import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to get query parameters
const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState(''); // State for collecting username
  const [password, setPassword] = useState(''); // State for collecting password
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    // Get the 'role' query parameter when the component loads
    const roleParam = getQueryParam('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  // Handle form submission based on role
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Prepare data to send to the API
    const formData = {
      username, // Collecting username
      password, // Collecting password
    };

    let apiUrl = '';
    if (role) {
      if (role === 'Admin') {
        apiUrl = 'http://localhost:3000/api/admin/login';
      } else if (role === 'Doctor') {
        apiUrl = 'http://localhost:3000/api/doctor/login';
      } else if (role === 'Patient') {
        apiUrl = 'http://localhost:3000/api/patient/login';
      }

      try {
        const response = await axios.post(apiUrl, formData);
        // Check for a successful response
        if (response.data.message === 'Logged in as patient') {
          // Handle successful login
          alert('Login successful: ' + response.data.message);
          const patientId = response.data.patientId; 
          navigate(`/patient?ID=${patientId}`);
        } else if (response.data.message === 'Logged in as admin') {
          // Handle successful admin login
          alert('Login successful: ' + response.data.message);
          const adminId = response.data.adminId; 
          navigate(`/admin?ID=${adminId}`); // Navigate with admin ID
        } else if (response.data.message === 'Logged in as doctor') {
          // Handle successful doctor login
          alert('Login successful: ' + response.data.message);
          const doctorId = response.data.doctorId;
          navigate(`/doctor?ID=${doctorId}`); // Navigate with doctor ID
        } else {
          setError(response.data.error || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error: ' + error.response?.data?.error || error.message); // Show error message
      }
    } else {
      alert('No role selected. Redirecting to role selection.');
      window.location.href = '/';
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Login Page</h2>
      {role && <p>Logging in as: {role}</p>}
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="login form">
        <div className="inputs">
          <input
            type="text"
            placeholder="Username"
            value={username} // Collecting username
            className="input-wrapper"
            onChange={(e) => setUsername(e.target.value)} // Update username
            required // Required field
          />
        </div>

        <div className="inputs">
          <input
            type="password"
            placeholder="Password"
            className="input-wrapper"
            value={password} // Collecting password
            onChange={(e) => setPassword(e.target.value)} // Update password
            required // Required field
          />
        </div>
        <button type="submit" className="login-button">
          {role === 'Patient' ? 'Login' : 'Login'} {/* Change button text based on role */}
        </button>
        {role === 'Patient' && ( // Show the register link only for patients
          <p className="signup-text">
            New Patient? <a className="anchor1" href="/register">Register now</a>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
