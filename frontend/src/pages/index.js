import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import HeroSlider from '../components/HeroSlider';
import { 
  FiCalendar, FiActivity, FiHeart, FiShield, FiClock, FiMapPin, 
  FiPhone, FiArrowRight, FiCheck, FiStar, FiTrendingUp,
  FiUsers, FiAward, FiHome, FiFileText
} from 'react-icons/fi';
import { FaStethoscope, FaMicroscope, FaHeartbeat, FaAmbulance } from 'react-icons/fa';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with top doctors in seconds'
    },
    {
      icon: <FiActivity className="w-6 h-6" />,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art lab tests and imaging services'
    },
    {
      icon: <FiHome className="w-6 h-6" />,
      title: 'Home Sample Collection',
      description: 'Convenient doorstep sample collection service'
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: 'NABL Certified Lab',
      description: 'Accurate results from certified laboratories'
    }
  ];

  const stats = [
    { value: '12hrs', label: 'Daily Service' }
  ];

  const services = [
    {
      icon: <FaStethoscope className="w-8 h-8" />,
      title: 'Doctor Consultation',
      description: 'Consult with experienced healthcare professionals',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FaMicroscope className="w-8 h-8" />,
      title: 'Lab Tests',
      description: 'Comprehensive diagnostic tests with quick results',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: <FaHeartbeat className="w-8 h-8" />,
      title: 'Health Packages',
      description: 'Customized health checkup packages for all ages',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <FaAmbulance className="w-8 h-8" />,
      title: 'Emergency Care',
      description: 'Ambulance and emergency medical services during working hours',
      color: 'from-red-500 to-red-600'
    }
  ];

  const testimonials = [];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <Layout>
      {/* Hero Slider - Admin can manage images */}
      <HeroSlider />

      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-primary-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-200"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-400"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
                <FiShield className="w-4 h-4 mr-2" />
                NABL Certified Healthcare
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Your Health,
                <span className="block gradient-text-primary">Our Priority</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
                Book appointments, diagnostic tests, and get expert healthcare services from the comfort of your home.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/book-doctor" className="btn-primary text-base px-8 py-4 group">
                  Book Doctor
                  <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/book-test" className="btn-outline text-base px-8 py-4">
                  Book Test
                </Link>
              </div>
              
              {/* My Bookings Link */}
              <div className="flex justify-center lg:justify-start">
                <Link href="/my-bookings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                  <FiFileText className="w-5 h-5" />
                  View My Bookings
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Features */}
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-20 lg:mb-0">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                        activeFeature === index
                          ? 'bg-primary-50 border-2 border-primary-200'
                          : 'bg-slate-50 border-2 border-transparent'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeFeature === index
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-slate-600'
                      } transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                      {activeFeature === index && (
                        <FiCheck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Emergency Card */}
              <div className="absolute -bottom-16 left-0 right-0 lg:-bottom-6 lg:-right-6 lg:left-auto bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6 max-w-xs mx-auto lg:mx-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium opacity-90">Emergency Contact</div>
                    <div className="text-lg font-bold">+91 9830016600</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Icon Based (No Images) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Our Services</h2>
            <p className="section-subheading mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={index === 0 ? '/book-doctor' : index === 1 ? '/book-test' : index === 3 ? 'tel:+919830016600' : '/services'}
                className="group card-modern hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4">{service.description}</p>
                <div className="flex items-center text-primary-600 font-medium">
                  {index === 3 ? 'Call Now' : 'Learn more'}
                  <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Why Choose BM Healthcare?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We combine cutting-edge technology with compassionate care to deliver the best healthcare experience.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <FiShield />, title: 'NABL Certified', desc: 'Accredited laboratory with ISO certification' },
                  { icon: <FiClock />, title: 'Quick Results', desc: 'Fast turnaround time with online access' },
                  { icon: <FiUsers />, title: 'Expert Team', desc: 'Experienced doctors and healthcare professionals' },
                  { icon: <FiAward />, title: 'Quality Care', desc: 'Committed to excellence in healthcare delivery' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary-600 mb-3">12hrs</div>
                  <div className="text-xl text-slate-900 font-semibold mb-2">Daily Service Available</div>
                  <div className="text-slate-600">8:00 AM - 8:00 PM, Open Every Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Book your appointment or diagnostic test today and experience quality healthcare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-doctor" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-soft hover:shadow-medium">
              Book Doctor
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/book-test" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-200">
              Book Test
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-lg text-slate-600 mb-8">
                We're here to help you with all your healthcare needs
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                    <p className="text-slate-600">
                      AS/85, Christanpara, P.O-Krishnapur, Kestopur<br />
                      24 North Parganas, Kolkata, West Bengal - 700102
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600">
                      <a href="tel:+919830016600" className="hover:text-primary-600">+91 9830016600</a> / 
                      <a href="tel:+919830036600" className="hover:text-primary-600"> +91 9830036600</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <FiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Working Hours</h3>
                    <p className="text-slate-600">
                      Monday - Sunday<br />
                      8:00 AM - 8:00 PM (Open Every Day)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d574.8246378118725!2d88.43549998386233!3d22.586659382397478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275005d198bb5%3A0x5d039fe4588d67e5!2sBM%20HEALTH%20CARE!5e0!3m2!1sen!2sin!4v1762541596502!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BM Healthcare Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
