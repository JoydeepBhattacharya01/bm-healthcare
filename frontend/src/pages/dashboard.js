import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiActivity, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import api from '../utils/api';

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [testBookings, setTestBookings] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalTests: 0,
    totalReports: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setDataLoading(true);
      const { data } = await api.get('/appointments');
      const allAppointments = data || [];
      
      const doctorAppointments = allAppointments.filter(apt => apt.type === 'doctor');
      const tests = allAppointments.filter(apt => apt.type === 'test');
      
      setAppointments(doctorAppointments.slice(0, 5));
      setTestBookings(tests.slice(0, 5));
      setStats({
        totalAppointments: doctorAppointments.length,
        totalTests: tests.length,
        totalReports: 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard - BM Healthcare">
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Dashboard - BM Healthcare">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-12 md:py-16 overflow-hidden mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{fontFamily: 'Poppins, sans-serif'}}>
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-primary-100">Manage your appointments and health records</p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-medical hover:shadow-medical-lg transition-all duration-250 border border-gray-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Appointments</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.totalAppointments}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
                  <FiCalendar className="text-primary-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-medical hover:shadow-medical-lg transition-all duration-250 border border-gray-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Test Bookings</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalTests}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
                  <FiActivity className="text-blue-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-medical hover:shadow-medical-lg transition-all duration-250 border border-gray-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Reports</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalReports}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
                  <FiFileText className="text-green-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-medical hover:shadow-medical-lg transition-all duration-250 border border-gray-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Profile</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
                  <FiUser className="text-gray-600" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Quick Actions */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-2xl shadow-medical border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Profile Information</h2>
                <div className="space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-gray-900 text-sm">{user?.email}</p>
                  </div>
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Phone</p>
                    <p className="font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Role</p>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 capitalize">{user?.role}</span>
                  </div>
                </div>
                <button className="mt-6 w-full border-2 border-primary-500 text-primary-600 py-2.5 rounded-full font-semibold hover:bg-primary-50 transition-all duration-250 text-sm">
                  Edit Profile
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-2xl shadow-medical border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/doctors" className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-full font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-250 shadow-medical hover:shadow-medical-lg hover:scale-105 text-center text-sm">
                    Book Appointment
                  </Link>
                  <Link href="/tests" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-250 shadow-medical hover:shadow-medical-lg hover:scale-105 text-center text-sm">
                    Book Test
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-250 font-semibold text-sm"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Appointments & Tests */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Appointments */}
              <div className="bg-white p-6 rounded-2xl shadow-medical border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                  <Link href="/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors">
                    View All →
                  </Link>
                </div>
                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="spinner mx-auto"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FiCalendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No appointments yet</p>
                    <Link href="/doctors" className="text-primary-500 hover:text-primary-600 text-sm mt-2 inline-block">
                      Book your first appointment
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt._id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-medical transition-all duration-250 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{apt.doctorName || 'Doctor'}</p>
                            <p className="text-sm text-gray-600">{apt.specialization || 'Consultation'}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-white rounded-lg py-2 px-3">
                          <FiCalendar className="mr-2 text-primary-600" size={14} />
                          <span className="font-medium">{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Test Bookings */}
              <div className="bg-white p-6 rounded-2xl shadow-medical border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Test Bookings</h2>
                  <Link href="/test-bookings" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                    View All →
                  </Link>
                </div>
                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="spinner mx-auto"></div>
                  </div>
                ) : testBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FiActivity size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No test bookings yet</p>
                    <Link href="/tests" className="text-secondary-500 hover:text-secondary-600 text-sm mt-2 inline-block">
                      Book your first test
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testBookings.map((test) => (
                      <div key={test._id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-medical transition-all duration-250 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{test.testName || 'Test'}</p>
                            <p className="text-sm text-gray-600">{test.category || 'Diagnostic Test'}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            test.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            test.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            test.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600 bg-white rounded-lg py-2 px-3 flex-1 mr-2">
                            <FiCalendar className="mr-2 text-blue-600" size={14} />
                            <span className="font-medium">{new Date(test.appointmentDate).toLocaleDateString()} at {test.appointmentTime}</span>
                          </div>
                          {test.homeCollection && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1.5 rounded-full font-semibold">Home Collection</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Reports */}
              <div className="bg-white p-6 rounded-2xl shadow-medical border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Medical Reports</h2>
                  <Link href="/reports" className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors">
                    View All →
                  </Link>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiFileText size={32} className="text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">No reports available</p>
                  <p className="text-sm">Your test reports will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-medical-xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>Need Help?</h2>
              <p className="mb-8 text-primary-100">Our support team is here to assist you</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-full font-semibold transition-all duration-250 shadow-medical-lg hover:shadow-medical-xl hover:scale-105">
                  Contact Support
                </Link>
                <Link href="/services" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-full font-semibold transition-all duration-250 shadow-medical hover:shadow-medical-lg hover:scale-105">
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
