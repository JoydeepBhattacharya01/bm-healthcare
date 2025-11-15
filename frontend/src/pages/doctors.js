import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import { FiSearch, FiFilter, FiMapPin, FiDollarSign, FiClock, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, [selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedSpecialization) params.specialization = selectedSpecialization;
      
      const { data } = await api.get('/doctors', { params });
      setDoctors(data.doctors || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Show sample data if backend is not available
      setDoctors([
        {
          _id: '1',
          name: 'Dr. Rajesh Kumar',
          specialization: 'Cardiologist',
          qualifications: 'MBBS, MD (Cardiology), DM',
          experience: 15,
          consultationFee: 800,
          bio: 'Experienced cardiologist with expertise in heart diseases and interventional cardiology.'
        },
        {
          _id: '2',
          name: 'Dr. Priya Sharma',
          specialization: 'Dermatologist',
          qualifications: 'MBBS, MD (Dermatology)',
          experience: 10,
          consultationFee: 600,
          bio: 'Specialist in skin care, hair treatment, and cosmetic dermatology.'
        },
        {
          _id: '3',
          name: 'Dr. Amit Patel',
          specialization: 'General Physician',
          qualifications: 'MBBS, MD (Medicine)',
          experience: 12,
          consultationFee: 500,
          bio: 'General physician with expertise in treating common ailments and preventive care.'
        }
      ]);
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const { data } = await api.get('/doctors/specializations/list');
      setSpecializations(data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSpecializations(['Cardiologist', 'Dermatologist', 'General Physician', 'Pediatrician', 'Orthopedic']);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Our Doctors - BM Healthcare">
      {/* Page Header */}
      <PageHeader 
        title="Our Expert Doctors"
        subtitle="Consult with experienced healthcare professionals"
        backgroundImage="/images/doctors.jpeg"
      />

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Filter by Specialization */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No doctors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="card hover:scale-105 transition-transform duration-200">
                  {/* Doctor Image Placeholder */}
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {doctor.name.charAt(0)}
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-primary-500 font-semibold">{doctor.specialization}</p>
                    <p className="text-sm text-gray-600 mt-1">{doctor.qualifications}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-gray-600">
                      <FiClock className="mr-2" />
                      <span className="text-sm">{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-600">
                      <FiDollarSign className="mr-2" />
                      <span className="text-sm font-semibold">₹{doctor.consultationFee} consultation</span>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="block w-full btn-primary text-center"
                  >
                    View Profile & Book
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find the Right Doctor?</h2>
          <p className="text-xl mb-8">Contact us and we'll help you find the perfect specialist</p>
          <Link href="/contact" className="btn-primary bg-white text-primary-500 hover:bg-gray-100">
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  );
}
