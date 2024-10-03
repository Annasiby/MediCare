import React from 'react'

const Login = () => {
  return (
    <div className="login-container">
    <h2 className="form-title">Log in with</h2>
    <div className="social-login">
      <button className="social-button">
        <image src="google.svg" alt="Google" className="social-icon" ></image>
      Google
      </button>
      <button className="social-button">
        <image src="apple.svg" alt="Apple" className="social-icon" ></image>
        Apple
      </button>
    </div>
    <p className="seperator"><span>or</span></p>

    <form action="#" className="login form">
      <div className="input-wrapper">
        <input type="email" placeholder="Email address" className="input-wrapper" required/>
        <i className="material-symbols-rounded">
mail
</i>
      </div>

      <div className="input-wrapper">
        <input type="password" placeholder="Password" className="input-wrapper" required/>
        <i className="material-symbols-rounded">
lock</i>
      </div>
    <a href="#" className="forgot-password-link">Forgot Password?</a>
    <button className="login-button">Login</button>
    </form>

    <p className="signup-text">Don't have an account? <a href="#">Sign up now</a></p>
  </div>
  )
}

export default Login
