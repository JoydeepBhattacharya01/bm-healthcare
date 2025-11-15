import { useState, useEffect } from 'react';
import Image from 'next/image';

const SectionHeader = ({ title, subtitle, images = [] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  return (
    <div className="relative h-48 md:h-64 overflow-hidden mb-12">
      {/* Sliding Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
