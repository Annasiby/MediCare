import React from 'react'

const Login = () => {
  return (
    <div className="login-container">
    <h2 className="form-title">Log in</h2>
    <div className="social-login">
      <button className="social-button">
        <img src="google.png" alt="Google" className="social-icon" />
      Google
      </button>
      <button className="social-button">
        <img src="apple.png" alt="Apple" className="social-icon" />
        Apple
      </button>
    </div>
    <p className="seperator"><span>or</span></p>

    <form action="#" className="login form">
      <div className="input-wrapper">
        <input type="email" placeholder="Email address" className="input-wrapper" required/>
        <img src="email.png" alt="Email" className="social-button"/>
      </div>

      <div className="input-wrapper">
        <input type="password" placeholder="Password" className="input-wrapper" required/>
        <img src="lock.png" alt="Lock" className="social-button"/>
      </div>
    <a href="#" className="forgot-password-link">Forgot Password?</a>
    <button className="login-button">Login</button>
    </form>

    <p className="signup-text">Don't have an account? <a href="#">Sign up now</a></p>
  </div>
  )
}

export default Login
