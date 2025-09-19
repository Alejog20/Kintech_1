import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import PropertyCard from './PropertyCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HottestPropertiesCarousel.css';

const HottestPropertiesCarousel = ({ properties, t, getPriceDisplay }) => {
  if (!properties || properties.length === 0) {
    return null; // Don't render anything if there are no properties
  }

  // Get the first 12 properties for the carousel
  const hottestProperties = properties.slice(0, 12);

  return (
    <div className="hottest-properties-carousel-container">
      <h2 className="carousel-title">Hottest Properties</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          // when window width is >= 640px
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          // when window width is >= 1440px
          1440: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {hottestProperties.map(property => (
          <SwiperSlide key={property.id}>
            <PropertyCard 
              property={property} 
              t={t} 
              priceDisplay={getPriceDisplay(property)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HottestPropertiesCarousel;
