import React, { useState, useContext } from 'react'; // 1. Importar useContext
import { LanguageContext } from '../context/LanguageContext'; // 2. Importar el contexto

function Contact() {
  const { language } = useContext(LanguageContext); // 3. Usar el contexto global
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const translations = {
    es: {
      getInTouch: "Ponte en Contacto",
      intro: "¿Listo para encontrar tu propiedad perfecta? Nuestro equipo de expertos está aquí para ayudarte.",
      contactInfo: "Información de Contacto",
      phone: "Teléfono",
      email: "Correo Electrónico",
      office: "Oficina",
      sendMessage: "Envíanos un Mensaje",
      form: {
        fullName: "Nombre Completo *",
        fullNamePlaceholder: "Escribe tu nombre completo",
        email: "Correo Electrónico *",
        emailPlaceholder: "Escribe tu correo electrónico",
        phone: "Número de Teléfono",
        phonePlaceholder: "Escribe tu número de teléfono",
        message: "Mensaje *",
        messagePlaceholder: "Cuéntanos sobre la propiedad que buscas...",
        submit: "Enviar Mensaje",
        submitting: "Enviando..."
      },
      successMessage: "¡Gracias! Nos pondremos en contacto contigo pronto."
    },
    en: {
      getInTouch: "Get In Touch",
      intro: "Ready to find your perfect property? Our expert team is here to help.",
      contactInfo: "Contact Information",
      phone: "Phone",
      email: "Email",
      office: "Office",
      sendMessage: "Send us a Message",
      form: {
        fullName: "Full Name *",
        fullNamePlaceholder: "Enter your full name",
        email: "Email Address *",
        emailPlaceholder: "Enter your email address",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        message: "Message *",
        messagePlaceholder: "Tell us about your property requirements...",
        submit: "Send Message",
        submitting: "Sending..."
      },
      successMessage: "Thank you! We'll be in touch soon."
    }
  };

  const t = translations[language];

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
      setSubmitMessage(t.successMessage);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>{t.getInTouch}</h1>
          <p>{t.intro}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>{t.contactInfo}</h3>
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon">📞</span>
                <div>
                  <h4>{t.phone}</h4>
                  <p>+57 300 123 4567</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="icon">✉️</span>
                <div>
                  <h4>{t.email}</h4>
                  <p>contacto@kintech.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="icon">📍</span>
                <div>
                  <h4>{t.office}</h4>
                  <p>Bocagrande, Av. San Martín<br />Cartagena, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h3>{t.sendMessage}</h3>
            
            {submitMessage && (
              <div className="form-message success">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t.form.fullName}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t.form.fullNamePlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t.form.emailPlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t.form.phone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.form.phonePlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{t.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder={t.form.messagePlaceholder}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.form.submitting : t.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
