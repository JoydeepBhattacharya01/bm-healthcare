import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiActivity, FiHeart, FiHome, FiClock, FiShield, FiUsers, FiFileText, FiEye } from 'react-icons/fi';
import { FaAmbulance } from 'react-icons/fa';

export default function Services() {

  const specialServices = [
    {
      icon: <FaAmbulance size={32} />,
      title: '24 Hours Ambulance Service',
      description: 'Emergency medical transport available round the clock',
      image: '/images/ambu.jpeg',
      features: [
        'Always ready for emergencies',
        'Patient transfer services',
        'Trained medical staff',
        'Well-equipped ambulances'
      ]
    },
    {
      icon: <FiHome size={32} />,
      title: 'Home Collection Service',
      description: 'Blood Sample and ECG collection at your doorstep',
      image: '/images/homecollection.jpeg',
      features: [
        'Trained professionals',
        'Safe and hygienic',
        'Flexible timing',
        'Convenient service'
      ]
    },
    {
      icon: <FiActivity size={32} />,
      title: 'Advanced Diagnostic Tests',
      description: 'CT Scan, MRI, ECHO, Endoscopy, Ultrasonography',
      image: '/images/test.jpeg',
      features: [
        'State-of-the-art equipment',
        'Experienced technicians',
        'Accurate results',
        'Quick turnaround'
      ]
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Elderly Care',
      description: 'Priority home visits and comfortable facilities',
      image: '/images/elder.jpeg',
      features: [
        'Priority service',
        'Comfortable facilities',
        'Home visits available',
        'Special assistance'
      ]
    },
    {
      icon: <FiShield size={32} />,
      title: 'Police & Ex-Servicemen',
      description: 'Exclusive healthcare support with discounted services',
      image: '/images/police.jpeg',
      features: [
        'Discounted services',
        'Priority care',
        'Dedicated support',
        'Special packages'
      ]
    },
    {
      icon: <FiClock size={32} />,
      title: 'Quick Blood Reports',
      description: 'Blood reports within 1 to 4 hours',
      image: '/images/delivery.png',
      features: [
        'Fast processing',
        'Reliable results',
        'Online access',
        'SMS notifications'
      ]
    },
    {
      icon: <FiEye size={32} />,
      title: 'AIIMS Eye Specialist',
      description: 'Expert eye care by AIIMS-experienced doctors',
      image: '/images/eye doctor.jpeg',
      features: [
        'AIIMS-trained doctors',
        'Comprehensive eye care',
        'Advanced treatments',
        'Expert consultation'
      ]
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Swasthya Sathi',
      description: 'Treatment facilities for card holders',
      image: '/images/swasthya sathi.jpeg',
      features: [
        'Card holder benefits',
        'Renowned hospitals',
        'Comprehensive coverage',
        'Easy processing'
      ]
    }
  ];

  const services = [
    {
      icon: <FiCalendar size={48} />,
      title: 'Doctor Consultation',
      description: 'Book appointments with experienced doctors across various specializations',
      features: [
        'Multiple specializations available',
        'Flexible time slots',
        'Online and in-person consultations',
        'Follow-up appointments'
      ],
      link: '/doctors'
    },
    {
      icon: <FiActivity size={48} />,
      title: 'Diagnostic Tests',
      description: 'Comprehensive range of laboratory tests with accurate results',
      features: [
        'Blood tests, urine tests, imaging',
        'NABL accredited laboratory',
        'Fast report delivery',
        'Online report access'
      ],
      link: '/tests'
    },
    {
      icon: <FiHome size={48} />,
      title: 'Home Sample Collection',
      description: 'Convenient sample collection service at your doorstep',
      features: [
        'Trained phlebotomists',
        'Safe and hygienic collection',
        'Flexible timing',
        'Affordable charges'
      ],
      link: '/tests'
    },
    {
      icon: <FiHeart size={48} />,
      title: 'Health Packages',
      description: 'Comprehensive health checkup packages for all age groups',
      features: [
        'Complete health screening',
        'Age-specific packages',
        'Preventive care focus',
        'Discounted pricing'
      ],
      link: '/tests?category=Health+Package'
    },
    {
      icon: <FiFileText size={48} />,
      title: 'Medical Reports',
      description: 'Easy access to all your medical reports online',
      features: [
        'Digital report storage',
        'Download anytime',
        'SMS notifications',
        'Secure and private'
      ],
      link: '/dashboard'
    },
    {
      icon: <FiShield size={48} />,
      title: 'Quality Assurance',
      description: 'NABL accredited lab with highest quality standards',
      features: [
        'ISO certified processes',
        'Quality control measures',
        'Experienced technicians',
        'State-of-the-art equipment'
      ],
      link: '/about'
    }
  ];

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'General Medicine',
    'ENT',
    'Ophthalmology',
    'Neurology',
    'Psychiatry',
    'Dentistry',
    'Urology'
  ];

  return (
    <Layout title="Our Services - BM Healthcare">
      {/* Page Header */}
      <PageHeader 
        title="Our Services"
        subtitle="Comprehensive healthcare solutions for you and your family"
        backgroundImage="/images/services.jpeg"
      />

      {/* Special Services Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Special Services</h2>
            <p className="section-subtitle">
              Exclusive healthcare services tailored for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialServices.map((service, index) => (
              <div key={index} className="card bg-white card-hover overflow-hidden group border border-gray-200 hover:border-primary-300 transition-all">
                <div className="relative h-48 mb-4 overflow-hidden rounded-t-xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-primary-600 mb-3 flex justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-center text-gray-800 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {service.description}
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Core Services</h2>
            <p className="section-subtitle">
              Quality healthcare services designed for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card card-hover group border border-gray-200 hover:border-primary-300 transition-all">
                <div className="text-primary-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-center text-sm">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-primary-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={service.link} className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg text-center block">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Medical Specializations</h2>
            <p className="section-subtitle">
              Expert doctors across multiple specializations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specializations.map((spec, index) => (
              <Link
                key={index}
                href={`/doctors?specialization=${spec}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center hover:bg-primary-50"
              >
                <p className="font-semibold text-gray-800">{spec}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/doctors" className="btn-primary">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple steps to book your appointment or test
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Create your account in minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Service</h3>
              <p className="text-gray-600">Select doctor or diagnostic test</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">Confirm booking and make payment</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Service</h3>
              <p className="text-gray-600">Visit clinic or get home service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BM Healthcare?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiShield size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted & Certified</h3>
              <p>NABL accredited lab with ISO certification</p>
            </div>

            <div className="text-center">
              <FiClock size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p>Fast report delivery and easy appointment booking</p>
            </div>

            <div className="text-center">
              <FiUsers size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p>Experienced doctors and trained technicians</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your appointment or diagnostic test today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/doctors" className="btn-primary">
              Book Doctor Appointment
            </Link>
            <Link href="/tests" className="btn-secondary">
              Book Diagnostic Test
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
