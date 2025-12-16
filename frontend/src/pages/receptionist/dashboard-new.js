import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  FiCalendar, FiFileText, FiSearch, FiPlus, FiCheck, FiX,
  FiClock, FiPhone, FiUser, FiActivity, FiTrendingUp
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ReceptionDashboard() {
  const { user, isAuthenticated, isReceptionist, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    todayTestBookings: 0,
    pendingTestBookings: 0,
    totalBookingsToday: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [testBookings, setTestBookings] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/receptionist/login');
      return;
    }

    if (!isReceptionist && !isAdmin) {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, isReceptionist, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      const [statsRes, appointmentsRes, testBookingsRes] = await Promise.all([
        axios.get(`${API_URL}/reception/stats`),
        axios.get(`${API_URL}/reception/appointments?limit=50`),
        axios.get(`${API_URL}/reception/test-bookings?limit=50`)
      ]);

      setStats(statsRes.data);
      setAppointments(appointmentsRes.data.appointments || []);
      setTestBookings(testBookingsRes.data.testBookings || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.put(`${API_URL}/reception/appointments/${id}/confirm`);
      toast.success('Appointment confirmed');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleRejectAppointment = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.put(`${API_URL}/reception/appointments/${id}/reject`, {
        cancellationReason: reason
      });
      toast.success('Appointment rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const handleConfirmTestBooking = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.put(`${API_URL}/reception/test-bookings/${id}/confirm`);
      toast.success('Test booking confirmed');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm test booking');
    }
  };

  const handleUpdateTestStatus = async (id, status) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.put(`${API_URL}/reception/test-bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'sample_collected': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patientMobile.includes(searchTerm) ||
    apt.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTestBookings = testBookings.filter(booking =>
    booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.patientMobile.includes(searchTerm) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Reception Dashboard - BM Healthcare">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">Reception Dashboard</h1>
            <p className="text-primary-100">Welcome back, {user?.name || 'Receptionist'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiCalendar className="text-primary-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.todayAppointments}</span>
              </div>
              <p className="text-sm text-slate-600">Today's Appointments</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiClock className="text-yellow-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.pendingAppointments}</span>
              </div>
              <p className="text-sm text-slate-600">Pending Appointments</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiCheck className="text-green-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.confirmedAppointments}</span>
              </div>
              <p className="text-sm text-slate-600">Confirmed</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiFileText className="text-primary-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.todayTestBookings}</span>
              </div>
              <p className="text-sm text-slate-600">Today's Tests</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiClock className="text-yellow-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.pendingTestBookings}</span>
              </div>
              <p className="text-sm text-slate-600">Pending Tests</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="text-blue-600 w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{stats.totalBookingsToday}</span>
              </div>
              <p className="text-sm text-slate-600">Total Today</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'appointments', label: 'Appointments' },
                { id: 'tests', label: 'Test Bookings' },
                { id: 'book-doctor', label: 'Book Doctor' },
                { id: 'book-test', label: 'Book Test' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          {(activeTab === 'appointments' || activeTab === 'tests' || activeTab === 'overview') && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, mobile, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Pending Appointments */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Appointments</h2>
                <div className="space-y-3">
                  {filteredAppointments.filter(apt => apt.status === 'pending').slice(0, 5).map(appointment => (
                    <div key={appointment._id} className="bg-white rounded-xl shadow-soft p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-slate-500">{appointment.bookingId}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <FiUser className="text-slate-400" />
                              <span className="font-medium">{appointment.patientName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-slate-400" />
                              <span>{appointment.patientMobile}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-slate-400" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="text-slate-400" />
                              <span>{appointment.appointmentTime}</span>
                            </div>
                          </div>
                          {appointment.doctor && (
                            <p className="text-sm text-slate-600 mt-2">Dr. {appointment.doctor.name}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmAppointment(appointment._id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectAppointment(appointment._id)}
                            className="btn-outline px-4 py-2 text-sm text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredAppointments.filter(apt => apt.status === 'pending').length === 0 && (
                    <p className="text-slate-500 text-center py-8">No pending appointments</p>
                  )}
                </div>
              </div>

              {/* Pending Test Bookings */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Test Bookings</h2>
                <div className="space-y-3">
                  {filteredTestBookings.filter(booking => booking.status === 'pending').slice(0, 5).map(booking => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-soft p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-slate-500">{booking.bookingId}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <FiUser className="text-slate-400" />
                              <span className="font-medium">{booking.patientName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-slate-400" />
                              <span>{booking.patientMobile}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-slate-400" />
                              <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="text-slate-400" />
                              <span>{booking.bookingTime}</span>
                            </div>
                          </div>
                          {booking.tests && (
                            <p className="text-sm text-slate-600 mt-2">
                              {booking.tests.length} test(s) - ₹{booking.totalAmount}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmTestBooking(booking._id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTestBookings.filter(booking => booking.status === 'pending').length === 0 && (
                    <p className="text-slate-500 text-center py-8">No pending test bookings</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-3">
              {filteredAppointments.map(appointment => (
                <div key={appointment._id} className="bg-white rounded-xl shadow-soft p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-slate-500">{appointment.bookingId}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Patient</p>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-slate-600">{appointment.patientMobile}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Date & Time</p>
                          <p className="font-medium">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                          <p className="text-slate-600">{appointment.appointmentTime}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Doctor</p>
                          <p className="font-medium">{appointment.doctor?.name || 'N/A'}</p>
                          <p className="text-slate-600">{appointment.doctor?.specialization || ''}</p>
                        </div>
                      </div>
                      {appointment.symptoms && (
                        <div className="text-sm">
                          <p className="text-slate-500 text-xs mb-1">Symptoms</p>
                          <p className="text-slate-700">{appointment.symptoms}</p>
                        </div>
                      )}
                    </div>
                    {appointment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmAppointment(appointment._id)}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(appointment._id)}
                          className="btn-outline px-4 py-2 text-sm text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredAppointments.length === 0 && (
                <p className="text-slate-500 text-center py-12">No appointments found</p>
              )}
            </div>
          )}

          {/* Test Bookings Tab */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              {filteredTestBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-xl shadow-soft p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-slate-500">{booking.bookingId}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Patient</p>
                          <p className="font-medium">{booking.patientName}</p>
                          <p className="text-slate-600">{booking.patientMobile}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Date & Time</p>
                          <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p className="text-slate-600">{booking.bookingTime}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Collection</p>
                          <p className="font-medium capitalize">{booking.collectionType}</p>
                          <p className="text-primary-600 font-semibold">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      {booking.tests && booking.tests.length > 0 && (
                        <div className="text-sm">
                          <p className="text-slate-500 text-xs mb-1">Tests</p>
                          <div className="space-y-1">
                            {booking.tests.map((testItem, idx) => (
                              <p key={idx} className="text-slate-700">• {testItem.test.name}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleConfirmTestBooking(booking._id)}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateTestStatus(booking._id, 'sample_collected')}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Mark Collected
                        </button>
                      )}
                      {booking.status === 'sample_collected' && (
                        <button
                          onClick={() => handleUpdateTestStatus(booking._id, 'completed')}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredTestBookings.length === 0 && (
                <p className="text-slate-500 text-center py-12">No test bookings found</p>
              )}
            </div>
          )}

          {/* Book Doctor Tab */}
          {activeTab === 'book-doctor' && (
            <div className="bg-white rounded-xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Book Doctor Appointment</h2>
              <p className="text-slate-600 mb-6">Use the public booking page to book appointments on behalf of patients</p>
              <button
                onClick={() => window.open('/book-doctor', '_blank')}
                className="btn-primary"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Open Booking Page
              </button>
            </div>
          )}

          {/* Book Test Tab */}
          {activeTab === 'book-test' && (
            <div className="bg-white rounded-xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Book Lab Test</h2>
              <p className="text-slate-600 mb-6">Use the public booking page to book tests on behalf of patients</p>
              <button
                onClick={() => window.open('/book-test', '_blank')}
                className="btn-primary"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Open Booking Page
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
