import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCalendar, FiActivity } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const slides = [
    {
      image: '/images/hero-1.jpeg',
      title: 'Advanced Diagnostic Services',
      subtitle: 'State-of-the-art medical testing with quick and accurate results',
      cta: { text: 'Book Test', link: '/tests', icon: <FiActivity /> }
    },
    {
      image: '/images/hero-2.jpeg',
      title: 'Expert Medical Consultation',
      subtitle: 'Consult with experienced doctors for comprehensive healthcare',
      cta: { text: 'Book Appointment', link: '/doctors', icon: <FiCalendar /> }
    },
    {
      image: '/images/hero-3.jpeg',
      title: 'Home Sample Collection',
      subtitle: 'Convenient doorstep sample collection service available',
      cta: { text: 'Book Now', link: '/tests', icon: <FiActivity /> }
    },
    {
      image: '/images/ambu.jpeg',
      title: 'Emergency Ambulance Service',
      subtitle: 'Emergency medical transport service during working hours',
      cta: { text: 'Call Now', link: 'tel:+919830016600', icon: <FiArrowRight /> }
    }
  ];

  return (
    <div className="relative w-full mt-20">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        loop={true}
        className="apollo-hero-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[320px] md:h-[380px] w-full overflow-hidden rounded-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-2xl text-white px-6 md:px-12">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-slate-100 animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.cta.link}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-fade-in-up animation-delay-400"
                  >
                    {slide.cta.icon}
                    <span className="ml-2">{slide.cta.text}</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .apollo-hero-slider .swiper-button-next,
        .apollo-hero-slider .swiper-button-prev {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .apollo-hero-slider .swiper-button-next:hover,
        .apollo-hero-slider .swiper-button-prev:hover {
          background: #14b8a6;
          transform: scale(1.1);
        }

        .apollo-hero-slider .swiper-button-next::after,
        .apollo-hero-slider .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
          color: #0f766e;
        }

        .apollo-hero-slider .swiper-button-next:hover::after,
        .apollo-hero-slider .swiper-button-prev:hover::after {
          color: white;
        }

        .apollo-hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .apollo-hero-slider .swiper-pagination-bullet-active {
          opacity: 1;
          background: #14b8a6;
          width: 32px;
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          .apollo-hero-slider .swiper-button-next,
          .apollo-hero-slider .swiper-button-prev {
            width: 36px;
            height: 36px;
          }

          .apollo-hero-slider .swiper-button-next::after,
          .apollo-hero-slider .swiper-button-prev::after {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
