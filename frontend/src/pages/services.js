import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Link from 'next/link';
import {
  FiCalendar,
  FiActivity,
  FiHeart,
  FiHome,
  FiClock,
  FiShield,
  FiUsers,
  FiFileText,
  FiEye,
  FiCheckCircle,
  FiArrowUpRight,
  FiChevronRight,
  FiTrendingUp
} from 'react-icons/fi';
import { FaAmbulance } from 'react-icons/fa';

export default function Services() {

  const specialServices = [
    {
      icon: <FaAmbulance size={32} />,
      title: '24 Hours Ambulance Service',
      description: 'Emergency medical transport available round the clock',
      accent: 'from-rose-500/15 via-orange-500/10 to-white',
      iconGradient: 'from-rose-500 to-orange-500',
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
      accent: 'from-emerald-500/12 via-teal-500/10 to-white',
      iconGradient: 'from-emerald-500 to-teal-500',
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
      accent: 'from-blue-500/12 via-cyan-500/10 to-white',
      iconGradient: 'from-blue-500 to-cyan-500',
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
      accent: 'from-purple-500/12 via-indigo-500/10 to-white',
      iconGradient: 'from-purple-500 to-indigo-500',
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
      accent: 'from-sky-500/12 via-blue-500/10 to-white',
      iconGradient: 'from-sky-500 to-blue-600',
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
      accent: 'from-amber-500/12 via-yellow-500/10 to-white',
      iconGradient: 'from-amber-500 to-amber-600',
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
      accent: 'from-indigo-500/12 via-violet-500/10 to-white',
      iconGradient: 'from-indigo-500 to-violet-500',
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
      accent: 'from-emerald-500/12 via-green-500/10 to-white',
      iconGradient: 'from-emerald-500 to-green-600',
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
      <section id="special-services" className="py-16 bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Special Services</h2>
            <p className="section-subtitle">
              Exclusive healthcare services tailored for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialServices.map((service, index) => (
              <div
                key={index}
                className={`card glass-card relative overflow-hidden group border border-white/60 bg-gradient-to-br ${service.accent} shadow-xl`}
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/40 rounded-full blur-3xl" aria-hidden="true" />
                <div className="absolute -left-12 -bottom-16 w-40 h-40 bg-primary-100/60 rounded-full blur-3xl group-hover:opacity-90 transition-opacity" aria-hidden="true" />

                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.iconGradient} text-white grid place-items-center shadow-lg`}>
                      {service.icon}
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.18em] bg-white/70 backdrop-blur px-3 py-1 rounded-full text-gray-700 font-semibold border border-white/80">
                      Priority
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>

                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <FiCheckCircle className="text-primary-500 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section id="core-services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Core Services</h2>
            <p className="section-subtitle">
              Quality healthcare services designed for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card card-hover group border border-primary-50/80 hover:border-primary-200/80 bg-white/90 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-teal-400 to-emerald-500 opacity-80" aria-hidden="true" />
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-50 rounded-full blur-2xl" aria-hidden="true" />
                <div className="absolute -left-14 bottom-0 w-32 h-32 bg-secondary-50 rounded-full blur-2xl" aria-hidden="true" />

                <div className="relative flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white grid place-items-center shadow-lg group-hover:scale-105 transition-transform">
                      {service.icon}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-4 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <FiCheckCircle className="text-primary-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.link}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    Learn More <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section id="specializations" className="py-16 bg-gradient-to-b from-white to-primary-50">
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
                className="bg-white/90 border border-primary-50/80 p-5 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between hover:bg-primary-50/60"
              >
                <p className="font-semibold text-gray-800">{spec}</p>
                <FiChevronRight className="text-primary-500" />
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
      <section id="process" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple steps to book your appointment or test
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Register', desc: 'Create your account in minutes' },
              { step: 2, title: 'Choose Service', desc: 'Select doctor or diagnostic test' },
              { step: 3, title: 'Book & Pay', desc: 'Confirm booking and make payment' },
              { step: 4, title: 'Get Service', desc: 'Visit clinic or get home service' }
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center group bg-white/80 border border-primary-50/80 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
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
      <section id="cta" className="py-16 bg-white">
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
