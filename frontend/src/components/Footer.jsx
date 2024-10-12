import React from 'react'

const Footer = React.forwardRef((props, ref) => {
  return (
    <div>
      <footer ref={ref} className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Emergency Contact</h3>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Email: emergency@hospital.com</p>
        </div>

        <div className="footer-section">
          <h3>Working Hours</h3>
          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p>Saturday: 10:00 AM - 5:00 PM</p>
          <p>Sunday: Closed</p>
        </div>

        <div className="footer-section">
          <h3>Address</h3>
          <p>123 Health St.,</p>
          <p>Medical City, State, 45678</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 XYZ Hospital. All rights reserved.</p>
      </div>
    </footer>
    </div>
  )
})

export default Footer
