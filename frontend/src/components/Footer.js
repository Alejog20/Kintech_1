import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // <-- ADD THIS LINE

function Footer() {
  // ... rest of the component code remains the same
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h1 className="logo-text">
              <Link to="/" className="logo">
                <span className="logo-icon">🏠</span>
                <span>Kintech</span>
              </Link>
            </h1>
            <p>
              Your trusted partner in finding the perfect Caribbean property. We offer exclusive listings and expert guidance.
            </p>
            <div className="socials">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><Link to="/">Properties</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section contact-form">
            <h2>Contact Us</h2>
            <form action="#">
              <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
              <textarea rows="2" name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Kintech Real Estate | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;