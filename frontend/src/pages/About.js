import React, { useContext } from 'react'; // 1. Quitar useState y useEffect, solo necesitamos useContext
import { LanguageContext } from '../context/LanguageContext'; // 2. Importar el contexto
import './About.css';

function About() {
  // 3. Usar el contexto global para obtener el idioma. No más estado local.
  const { language } = useContext(LanguageContext); 

  const translations = {
    es: {
      title: "Sobre Nosotros",
      subtitle: "Tu Socio de Confianza en el Mercado Inmobiliario del Caribe",
      missionTitle: "Nuestra Misión",
      missionText: "Nuestra misión es conectar a las personas con sus propiedades soñadas en el Caribe colombiano, ofreciendo un servicio excepcional, transparente y personalizado. Nos esforzamos por superar las expectativas en cada paso del proceso.",
      visionTitle: "Nuestra Visión",
      visionText: "Ser la agencia inmobiliaria líder y más respetada de la región, reconocida por nuestra integridad, innovación y profundo conocimiento del mercado local. Aspiramos a transformar la experiencia de compra y alquiler de propiedades de lujo.",
      teamTitle: "Conoce a Nuestro Equipo",
      teamMember1Name: "Laura Gómez",
      teamMember1Role: "Agente Principal",
      teamMember2Name: "Carlos Rivas",
      teamMember2Role: "Especialista en Alquileres",
      teamMember3Name: "Sofía Pérez",
      teamMember3Role: "Consultora de Inversiones",
    },
    en: {
      title: "About Us",
      subtitle: "Your Trusted Partner in the Caribbean Real Estate Market",
      missionTitle: "Our Mission",
      missionText: "Our mission is to connect people with their dream properties in the Colombian Caribbean by offering exceptional, transparent, and personalized service. We strive to exceed expectations at every step of the process.",
      visionTitle: "Our Vision",
      visionText: "To be the leading and most respected real estate agency in the region, recognized for our integrity, innovation, and deep knowledge of the local market. We aspire to transform the experience of buying and renting luxury properties.",
      teamTitle: "Meet Our Team",
      teamMember1Name: "Laura Gómez",
      teamMember1Role: "Lead Agent",
      teamMember2Name: "Carlos Rivas",
      teamMember2Role: "Rental Specialist",
      teamMember3Name: "Sofía Pérez",
      teamMember3Role: "Investment Consultant",
    }
  };

  const t = translations[language];

  return (
    <div className="about-us-page">
      {/* 4. El botón de idioma que estaba aquí ha sido ELIMINADO */}

      <header className="about-hero">
        <div className="container text-center">
          <h1 className="about-title">{t.title}</h1>
          <p className="about-subtitle">{t.subtitle}</p>
        </div>
      </header>

      <section className="about-mission-vision container">
        <div className="info-card">
          <h3>{t.missionTitle}</h3>
          <p>{t.missionText}</p>
        </div>
        <div className="info-card">
          <h3>{t.visionTitle}</h3>
          <p>{t.visionText}</p>
        </div>
      </section>

      {/* ...el resto del componente permanece igual... */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title text-center">{t.teamTitle}</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500" alt={t.teamMember1Name} />
              <h4>{t.teamMember1Name}</h4>
              <p>{t.teamMember1Role}</p>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1557862921-37829c790f19?w=500" alt={t.teamMember2Name} />
              <h4>{t.teamMember2Name}</h4>
              <p>{t.teamMember2Role}</p>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1542744095-291d1f67b221?w=500" alt={t.teamMember3Name} />
              <h4>{t.teamMember3Name}</h4>
              <p>{t.teamMember3Role}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
