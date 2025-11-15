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
      <section className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=400&fit=crop)',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg">Manage your appointments and health records</p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Appointments</p>
                  <p className="text-3xl font-bold text-primary-500">{stats.totalAppointments}</p>
                </div>
                <FiCalendar className="text-primary-500" size={40} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Test Bookings</p>
                  <p className="text-3xl font-bold text-secondary-500">{stats.totalTests}</p>
                </div>
                <FiActivity className="text-secondary-500" size={40} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Reports</p>
                  <p className="text-3xl font-bold text-green-500">{stats.totalReports}</p>
                </div>
                <FiFileText className="text-green-500" size={40} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Profile</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{user?.role}</p>
                </div>
                <FiUser className="text-gray-500" size={40} />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Quick Actions */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className="badge badge-info capitalize">{user?.role}</span>
                  </div>
                </div>
                <button className="mt-4 w-full btn-outline text-sm">
                  Edit Profile
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/doctors" className="block w-full btn-primary text-center">
                    Book Appointment
                  </Link>
                  <Link href="/tests" className="block w-full btn-secondary text-center">
                    Book Test
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
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
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Appointments</h2>
                  <Link href="/appointments" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                    View All
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
                      <div key={apt._id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{apt.doctorName || 'Doctor'}</p>
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
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-2" size={14} />
                          <span>{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Test Bookings */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Test Bookings</h2>
                  <Link href="/test-bookings" className="text-secondary-500 hover:text-secondary-600 text-sm font-medium">
                    View All
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
                      <div key={test._id} className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{test.testName || 'Test'}</p>
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
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" size={14} />
                            <span>{new Date(test.appointmentDate).toLocaleDateString()} at {test.appointmentTime}</span>
                          </div>
                          {test.homeCollection && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Home Collection</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Reports */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Medical Reports</h2>
                  <Link href="/reports" className="text-green-500 hover:text-green-600 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <FiFileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No reports available</p>
                  <p className="text-sm mt-2">Your test reports will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
            <p className="mb-6">Our support team is here to assist you</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary bg-white text-primary-500 hover:bg-gray-100">
                Contact Support
              </Link>
              <Link href="/services" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
