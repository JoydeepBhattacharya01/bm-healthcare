import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiFileText, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatTime12Hour, generateTimeSlots } from '../utils/timeUtils';

export default function BookDoctor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    patientMobile: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${API_URL}/doctors`);
      setDoctors(response.data.doctors || response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    if (!formData.patientName || !formData.patientMobile || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.patientMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await axios.post(`${API_URL}/bookings/appointments`, {
        ...formData,
        doctor: selectedDoctor._id
      });

      setBookingId(response.data.bookingId);
      setBookingSuccess(true);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !formData.appointmentDate) return [];

    const selectedDate = new Date(formData.appointmentDate);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    const daySlots = selectedDoctor.availableSlots?.filter(slot => slot.day === dayName) || [];

    const timeSlots = [];
    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        timeSlots.push({
          value: timeStr,
          label: formatTime12Hour(timeStr)
        });

        currentMin += slot.slotDuration || 30;
        if (currentMin >= 60) {
          currentHour += 1;
          currentMin -= 60;
        }
      }
    });

    return timeSlots;
  };

  if (bookingSuccess) {
    return (
      <Layout title="Booking Confirmed - BM Healthcare">
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 pt-28">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
              <p className="text-lg text-slate-600 mb-6">
                Your appointment has been booked successfully.
              </p>
              <div className="bg-primary-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-600 mb-2">Your Booking ID</p>
                <p className="text-3xl font-bold text-primary-600">{bookingId}</p>
                <p className="text-sm text-slate-500 mt-2">Save this ID to check your appointment status</p>
              </div>
              <div className="space-y-3 text-left mb-8">
                <div className="flex items-center gap-3">
                  <FiUser className="text-primary-600" />
                  <div>
                    <p className="text-sm text-slate-500">Patient Name</p>
                    <p className="font-medium text-slate-900">{formData.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-primary-600" />
                  <div>
                    <p className="text-sm text-slate-500">Mobile Number</p>
                    <p className="font-medium text-slate-900">{formData.patientMobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-primary-600" />
                  <div>
                    <p className="text-sm text-slate-500">Appointment Date & Time</p>
                    <p className="font-medium text-slate-900">
                      {new Date(formData.appointmentDate).toLocaleDateString()} at {formatTime12Hour(formData.appointmentTime)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/my-bookings')}
                  className="btn-primary"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-outline"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Book Doctor Appointment - BM Healthcare">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 pt-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Doctor Appointment</h1>
            <p className="text-lg text-slate-600">Choose a doctor and schedule your appointment</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Booking Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Book Doctor Appointment</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Doctor Selection Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Select Doctor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDoctor?._id || ''}
                      onChange={(e) => {
                        const doctor = doctors.find(d => d._id === e.target.value);
                        setSelectedDoctor(doctor);
                      }}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.filter(d => d.isActive).map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name} - {doctor.specialization} - ₹{doctor.consultationFee}
                        </option>
                      ))}
                    </select>
                    {selectedDoctor && (
                      <div className="mt-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <h4 className="font-semibold text-slate-900 mb-2">Dr. {selectedDoctor.name}</h4>
                        <p className="text-sm text-slate-600">{selectedDoctor.specialization}</p>
                        <p className="text-sm text-primary-600 font-medium mt-1">Consultation Fee: ₹{selectedDoctor.consultationFee}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Patient Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                        <input
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                        <input
                          type="tel"
                          name="patientMobile"
                          value={formData.patientMobile}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400"
                          placeholder="Enter 10-digit mobile number"
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Appointment Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 pointer-events-none" />
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900"
                          required
                        />
                      </div>
                      {!selectedDoctor && (
                        <p className="text-xs text-amber-600 mt-1">Please select a doctor first</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Appointment Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 pointer-events-none" />
                        <select
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                          required
                          disabled={!selectedDoctor || !formData.appointmentDate}
                        >
                          <option value="">Select time slot</option>
                          {getAvailableTimeSlots().map((slot) => (
                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                          ))}
                        </select>
                      </div>
                      {(!selectedDoctor || !formData.appointmentDate) && (
                        <p className="text-xs text-amber-600 mt-1">Select doctor and date first</p>
                      )}
                      {selectedDoctor && formData.appointmentDate && getAvailableTimeSlots().length === 0 && (
                        <p className="text-xs text-red-600 mt-1">No slots available for selected date</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Symptoms / Reason for Visit
                    </label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-3 text-primary-500" />
                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 min-h-[100px] resize-y"
                        placeholder="Describe your symptoms or reason for consultation (e.g., fever, headache, routine checkup)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 min-h-[80px] resize-y"
                      placeholder="Any additional information (allergies, medications, special requirements)"
                    />
                  </div>

                  {!selectedDoctor && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
                      <p className="text-amber-800 font-medium">Please select a doctor to continue</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !selectedDoctor}
                    className="w-full py-4 text-lg font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Booking Appointment...' : 'Confirm Appointment Booking'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
