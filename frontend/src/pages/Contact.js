import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you! We\'ll be in touch soon.');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>Ready to find your perfect property? Our expert team is here to help.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+44 20 7946 0958</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>hello@primeprop.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="icon">📍</span>
                <div>
                  <h4>Office</h4>
                  <p>123 Property Street<br />London, SW1A 1AA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h3>Send us a Message</h3>
            
            {submitMessage && (
              <div className="form-message success">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Tell us about your property requirements..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;