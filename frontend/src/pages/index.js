import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { FiCalendar, FiActivity, FiHeart, FiShield, FiClock, FiMapPin, FiTruck, FiHome, FiEye, FiUsers, FiAward, FiZap, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaAmbulance, FaUserMd, FaHeartbeat, FaStethoscope } from 'react-icons/fa';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    '/images/hero-1.jpeg',
    '/images/hero-2.jpeg',
    '/images/hero-3.jpeg',
    '/images/ambu.jpeg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const specialServices = [
    {
      icon: <FaAmbulance size={32} />,
      title: '24 Hours Ambulance Service',
      description: 'Emergency medical transport available round the clock',
      image: '/images/ambu.jpeg'
    },
    {
      icon: <FiHome size={32} />,
      title: 'Home Collection Service',
      description: 'Blood Sample and ECG collection at your doorstep',
      image: '/images/homecollection.jpeg'
    },
    {
      icon: <FiActivity size={32} />,
      title: 'Advanced Diagnostic Tests',
      description: 'CT Scan, MRI, ECHO, Endoscopy, Ultrasonography',
      image: '/images/test.jpeg'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Elderly Care',
      description: 'Priority home visits and comfortable facilities',
      image: '/images/elder.jpeg'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Police & Ex-Servicemen',
      description: 'Exclusive healthcare support with discounted services',
      image: '/images/police.jpeg'
    },
    {
      icon: <FiClock size={32} />,
      title: 'Quick Blood Reports',
      description: 'Blood reports within 1 to 4 hours',
      image: '/images/delivery.png'
    },
    {
      icon: <FiEye size={32} />,
      title: 'AIIMS Eye Specialist',
      description: 'Expert eye care by AIIMS-experienced doctors',
      image: '/images/eye doctor.jpeg'
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Swasthya Sathi',
      description: 'Treatment facilities for card holders',
      image: '/images/swasthya sathi.jpeg'
    }
  ];

  const healthPackages = [
    {
      icon: <FaHeartbeat size={32} />,
      title: 'Diabetes Care Package',
      description: 'Comprehensive diabetes screening and monitoring',
      tests: 'HbA1c, Fasting Sugar, PP Sugar, Lipid Profile'
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Cardiovascular Package',
      description: 'Complete heart health assessment',
      tests: 'ECG, ECHO, Lipid Profile, Cardiac Enzymes'
    },
    {
      icon: <FaStethoscope size={32} />,
      title: 'Full Body Checkup',
      description: 'Complete health screening for all age groups',
      tests: 'CBC, LFT, KFT, Thyroid, Vitamin D, B12'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Senior Citizen Package',
      description: 'Specialized health checkup for elderly',
      tests: 'Bone Density, Cardiac Profile, Diabetes Screening'
    }
  ];

  const whyChooseUs = [
    {
      icon: <FiShield size={48} />,
      title: 'Trusted & Certified',
      description: 'NABL accredited laboratory with ISO certification'
    },
    {
      icon: <FiClock size={48} />,
      title: 'Quick Results',
      description: 'Fast turnaround time with online access'
    },
    {
      icon: <FiMapPin size={48} />,
      title: 'Home Collection',
      description: 'Convenient doorstep sample collection'
    }
  ];

  return (
    <Layout>
      {/* Hero Section - Sliding Carousel */}
      <section className="relative w-full overflow-hidden group">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide}
                alt={`BM Healthcare ${index + 1}`}
                fill
                className={slide === '/images/ambu.jpeg' ? 'object-cover object-left' : 'object-cover'}
                priority={index === 0}
                sizes="100vw"
              />
              {/* Text overlay for ambulance slide */}
              {slide === '/images/ambu.jpeg' && (
                <div className="absolute inset-0 flex items-center justify-end pr-4 md:pr-12 lg:pr-20">
                  <div className="bg-red-600/90 backdrop-blur-sm text-white px-6 py-8 md:px-10 md:py-12 rounded-2xl shadow-2xl max-w-md">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>
                      24×7 Ambulance Service
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl mb-4 font-medium">
                      Emergency Medical Transport Available Round the Clock
                    </p>
                    <div className="flex flex-col gap-3">
                      <a href="tel:+919830016600" className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                        <FiPhone size={20} />
                        <span>+91 9830016600</span>
                      </a>
                      <a href="tel:+919830036600" className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                        <FiPhone size={20} />
                        <span>+91 9830036600</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Previous Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <FiChevronRight size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </section>

      {/* Brand Banner Below Hero */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3" style={{fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.01em'}}>
            B.M HEALTH CARE
          </h1>
          <div className="text-xs md:text-sm lg:text-base font-medium mb-2 tracking-wider">
            DIAGNOSTIC | POLY CLINIC | AMBULANCE | PORTABLE SERVICES
          </div>
          <p className="text-base md:text-lg italic mb-6 text-primary-100">
            বিশ্বাস আপনার, সেবা আমাদের
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/doctors" className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base">
              Book Appointment
            </Link>
            <Link href="/tests" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base">
              Book Test
            </Link>
            <a href="tel:+919830016600" className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 text-sm md:text-base">
              <FiPhone size={18} />
              <span>Emergency</span>
            </a>
          </div>
        </div>
      </section>


      {/* Emergency Ambulance Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Ambulance Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/ambu.jpeg"
                alt="24 Hours Ambulance Service"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                EMERGENCY SERVICE
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900" style={{fontFamily: 'Poppins, sans-serif'}}>
                24 Hours Ambulance Service Available
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Round-the-clock emergency medical transport with trained staff and well-equipped ambulances. Always ready to serve you in critical situations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="tel:+919830016600" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 text-base md:text-lg">
                  <FiPhone size={20} />
                  <span>Call Now: +91 9830016600</span>
                </a>
                <a href="tel:+919830036600" className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 text-base md:text-lg">
                  <FiPhone size={20} />
                  <span>+91 9830036600</span>
                </a>
              </div>
              <div className="mt-6 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <FiClock className="text-red-600" size={20} />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiShield className="text-red-600" size={20} />
                  <span>Trained Staff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Healthcare Packages</h2>
            <p className="section-subtitle">
              Specialized health checkup packages designed for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthPackages.map((pkg, index) => (
              <Link
                key={index}
                href="/tests?category=Health+Package"
                className="card text-center card-hover group border border-gray-200 hover:border-primary-300 transition-all"
              >
                <div className="text-primary-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {pkg.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                <p className="text-xs text-gray-500 italic">{pkg.tests}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose BM Healthcare?</h2>
            <p className="section-subtitle">
              Your trusted healthcare partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg card-hover group border border-gray-200 hover:border-primary-300 transition-all">
              <div className="text-primary-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800 group-hover:text-primary-600 transition-colors">{item.title}</h3>
              <p className="text-gray-600 text-center text-sm">
                {item.description}
              </p>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{fontFamily: 'Poppins, sans-serif'}}>
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light">
            Book your appointment or diagnostic test today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/doctors" className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base md:text-lg">
              Find a Doctor
            </Link>
            <Link href="/tests" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base md:text-lg">
              Browse Tests
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">We're here to help you with all your healthcare needs</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-primary-50 rounded-xl">
                <FiMapPin className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Address</h4>
                  <p className="text-gray-600 text-sm">
                    AS/85, Christanpara, P.O-Krishnapur, Kestopur<br />
                    24 North Parganas, Kolkata, West Bengal - 700102
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-6 bg-primary-50 rounded-xl">
                <FiPhone className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Phone</h4>
                  <p className="text-gray-600 text-sm">
                    +91 9830016600 / +91 9830036600
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-6 bg-primary-50 rounded-xl">
                <FiClock className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Working Hours</h4>
                  <p className="text-gray-600 text-sm">
                    Monday - Sunday<br />
                    8:00 AM - 8:00 PM (Open Every Day)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-xl overflow-hidden shadow-lg h-full min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d574.8246378118725!2d88.43549998386233!3d22.586659382397478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275005d198bb5%3A0x5d039fe4588d67e5!2sBM%20HEALTH%20CARE!5e0!3m2!1sen!2sin!4v1762541596502!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BM Healthcare Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
