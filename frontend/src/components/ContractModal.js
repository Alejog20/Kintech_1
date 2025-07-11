import React, { useState, useEffect } from 'react';

function ContactModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'viewing',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
        setFormData({ name: '', email: '', phone: '', inquiryType: 'viewing', message: '' });
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Quick Inquiry</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {property && (
          <div className="property-context">
            <img src={property.image} alt={property.title} className="property-thumb" />
            <div className="property-info">
              <h4>{property.title}</h4>
              <p>{property.location}</p>
              <span className="property-price">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  maximumFractionDigits: 0
                }).format(property.price)}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleInputChange}
            >
              <option value="viewing">Book a Viewing</option>
              <option value="info">Request Information</option>
              <option value="mortgage">Mortgage Advice</option>
              <option value="valuation">Property Valuation</option>
            </select>
          </div>

          <div className="form-row">
            <textarea
              name="message"
              placeholder="Any specific questions or requirements?"
              value={formData.message}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            {submitStatus === 'success' && (
              <div className="success-message">
                ✅ Thank you! We'll be in touch within 24 hours.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message">
                ❌ Something went wrong. Please try again.
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>

        <div className="trust-indicators">
          <div className="trust-item">
            <span>🔒</span>
            <small>Your details are secure</small>
          </div>
          <div className="trust-item">
            <span>⚡</span>
            <small>Response within 1 hour</small>
          </div>
          <div className="trust-item">
            <span>👥</span>
            <small>Expert guidance</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;