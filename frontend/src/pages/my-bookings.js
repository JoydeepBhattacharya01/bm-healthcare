import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FiPhone, FiSearch, FiCalendar, FiClock, FiUser, FiFileText, FiMapPin, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatTime12Hour } from '../utils/timeUtils';

export default function MyBookings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [bookings, setBookings] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${API_URL}/bookings/lookup/${mobileNumber}`);
      setBookings(response.data);
      
      if (response.data.appointments.length === 0 && response.data.testBookings.length === 0) {
        toast.info('No bookings found for this mobile number');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'sample_collected':
        return 'bg-purple-100 text-purple-700';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5" />;
      case 'pending':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiClock className="w-5 h-5" />;
    }
  };

  return (
    <Layout title="My Bookings - BM Healthcare">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 pt-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">My Bookings</h1>
            <p className="text-lg text-slate-600">Enter your mobile number to view your appointments and test bookings</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                Mobile Number
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiSearch />
                      Search
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {bookings && (
            <div className="space-y-8">
              {/* Doctor Appointments */}
              {bookings.appointments && bookings.appointments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="text-primary-600" />
                    Doctor Appointments ({bookings.appointments.length})
                  </h2>
                  <div className="space-y-4">
                    {bookings.appointments.map((appointment) => (
                      <div key={appointment._id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                {appointment.status.toUpperCase()}
                              </div>
                              <span className="text-sm font-mono text-slate-500">ID: {appointment.bookingId}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiUser className="text-slate-400" />
                                <span className="font-semibold text-slate-900">{appointment.patientName}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FiCalendar className="text-primary-600" />
                                <span className="text-slate-700">
                                  {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FiClock className="text-primary-600" />
                                <span className="text-slate-700">{formatTime12Hour(appointment.appointmentTime)}</span>
                              </div>

                              {appointment.doctor && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-600">Doctor</p>
                                  <p className="font-semibold text-slate-900">{appointment.doctor.name}</p>
                                  <p className="text-sm text-slate-600">{appointment.doctor.specialization}</p>
                                  <p className="text-sm text-primary-600 font-medium mt-1">Fee: ₹{appointment.doctor.consultationFee}</p>
                                </div>
                              )}

                              {appointment.symptoms && (
                                <div className="mt-3">
                                  <p className="text-sm text-slate-600">Symptoms</p>
                                  <p className="text-slate-700">{appointment.symptoms}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Bookings */}
              {bookings.testBookings && bookings.testBookings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FiFileText className="text-primary-600" />
                    Test Bookings ({bookings.testBookings.length})
                  </h2>
                  <div className="space-y-4">
                    {bookings.testBookings.map((booking) => (
                      <div key={booking._id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status.replace('_', ' ').toUpperCase()}
                              </div>
                              <span className="text-sm font-mono text-slate-500">ID: {booking.bookingId}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiUser className="text-slate-400" />
                                <span className="font-semibold text-slate-900">{booking.patientName}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FiCalendar className="text-primary-600" />
                                <span className="text-slate-700">
                                  {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FiClock className="text-primary-600" />
                                <span className="text-slate-700">{formatTime12Hour(booking.bookingTime)}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <FiMapPin className="text-primary-600" />
                                <span className="text-slate-700 capitalize">{booking.collectionType} Collection</span>
                              </div>

                              {booking.tests && booking.tests.length > 0 && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-600 mb-2">Tests</p>
                                  {booking.tests.map((testItem, idx) => (
                                    <div key={idx} className="flex justify-between items-center mb-1">
                                      <span className="text-slate-900">{testItem.test.name}</span>
                                      <span className="text-primary-600 font-medium">₹{testItem.price}</span>
                                    </div>
                                  ))}
                                  <div className="border-t mt-2 pt-2 flex justify-between items-center">
                                    <span className="font-semibold text-slate-900">Total Amount</span>
                                    <span className="text-lg font-bold text-primary-600">₹{booking.totalAmount}</span>
                                  </div>
                                </div>
                              )}

                              {booking.collectionType === 'home' && booking.collectionAddress && (
                                <div className="mt-3">
                                  <p className="text-sm text-slate-600">Collection Address</p>
                                  <p className="text-slate-700">
                                    {booking.collectionAddress.street}, {booking.collectionAddress.city}
                                    {booking.collectionAddress.pincode && ` - ${booking.collectionAddress.pincode}`}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Bookings */}
              {bookings.appointments.length === 0 && bookings.testBookings.length === 0 && (
                <div className="bg-white rounded-xl shadow-soft p-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Bookings Found</h3>
                  <p className="text-slate-600 mb-6">We couldn't find any bookings for this mobile number.</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => router.push('/book-doctor')}
                      className="btn-primary"
                    >
                      Book Doctor
                    </button>
                    <button
                      onClick={() => router.push('/book-test')}
                      className="btn-outline"
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {!bookings && (
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div
                onClick={() => router.push('/book-doctor')}
                className="bg-white rounded-xl shadow-soft p-8 cursor-pointer hover:shadow-medium transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiCalendar className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Book Doctor Appointment</h3>
                <p className="text-slate-600">Schedule a consultation with our expert doctors</p>
              </div>

              <div
                onClick={() => router.push('/book-test')}
                className="bg-white rounded-xl shadow-soft p-8 cursor-pointer hover:shadow-medium transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiFileText className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Book Lab Test</h3>
                <p className="text-slate-600">Get diagnostic tests done with home collection option</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
