
import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Cartagena, Colombia"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Experience Cartagena, Redefined.
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Discover our exclusive collection of luxury rentals for an unforgettable stay.
        </p>
        <button className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105 duration-300 ease-in-out">
          Browse Properties
        </button>
      </div>
    </div>
  );
};

export default Hero;
