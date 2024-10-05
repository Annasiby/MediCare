import React, { useState } from 'react';

const Register = () => {
  // State for form fields
  const [FName, setFName] = useState('');
  const [LName, setLName] = useState('');
  const [DOB, setDOB] = useState('');
  const [gender, setGender] = useState('Male');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation for passwords
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Prepare the form data
    const formData = {
      FName,
      LName,
      DOB,
      gender,
      phone_no: phoneNo,
      email,
      address,
      username,
      password,
      confirmPassword
    };

    // Submit the form data to the API
    fetch('/api/patient/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert('Registration failed: ' + data.error);
        } else {
          alert('Registration successful: ' + data.message);
          // Redirect to patient login page
          window.location.href = '/login'; // Adjust URL as needed
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form id="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="FName">First Name:</label>
        <input
          type="text"
          id="FName"
          name="FName"
          value={FName}
          onChange={(e) => setFName(e.target.value)}
          required
        />

        <label htmlFor="LName">Last Name:</label>
        <input
          type="text"
          id="LName"
          name="LName"
          value={LName}
          onChange={(e) => setLName(e.target.value)}
          required
        />

        <label htmlFor="DOB">Date of Birth:</label>
        <input
          type="date"
          id="DOB"
          name="DOB"
          value={DOB}
          onChange={(e) => setDOB(e.target.value)}
          required
        />

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="phone_no">Phone Number:</label>
        <input
          type="text"
          id="phone_no"
          name="phone_no"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
