import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiPhone, FiMail, FiAward, FiStar, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DoctorDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/doctors/${id}`);
      setDoctor(data);
      setAvailableSlots(data.availableSlots || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      // Sample data for testing
      setDoctor({
        _id: id,
        name: 'Dr. Rajesh Kumar',
        specialization: 'Cardiologist',
        qualifications: 'MBBS, MD (Cardiology), DM',
        experience: 15,
        consultationFee: 800,
        phone: '9830016600',
        email: 'dr.rajesh@bmhealthcare.com',
        bio: 'Experienced cardiologist with expertise in heart diseases and interventional cardiology. Specialized in treating complex cardiac conditions with a patient-centric approach.',
        rating: 4.8,
        totalReviews: 156,
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Tuesday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Wednesday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Thursday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Friday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Saturday', startTime: '10:00', endTime: '14:00', slotDuration: 30 }
        ]
      });
      setAvailableSlots([
        { day: 'Monday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Tuesday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Wednesday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Thursday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Friday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', slotDuration: 30 }
      ]);
      setLoading(false);
    }
  };

  const generateTimeSlots = (startTime, endTime, duration = 30) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentTime = startHour * 60 + startMin;
    const endTimeMin = endHour * 60 + endMin;
    
    while (currentTime < endTimeMin) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      slots.push(timeString);
      currentTime += duration;
    }
    
    return slots;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      setBookingLoading(true);

      const appointmentData = {
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: selectedDate,
        time: selectedTime,
        consultationFee: doctor.consultationFee,
        type: 'doctor'
      };

      const { data } = await api.post('/appointments', appointmentData);
      
      toast.success('Appointment booked successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to book an appointment');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to book appointment');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const getDaySlots = (dayName) => {
    const daySlot = availableSlots.find(slot => slot.day === dayName);
    if (!daySlot) return [];
    return generateTimeSlots(daySlot.startTime, daySlot.endTime, daySlot.slotDuration || 30);
  };

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return days;
  };

  if (loading) {
    return (
      <Layout title="Loading... - BM Healthcare">
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout title="Doctor Not Found - BM Healthcare">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
            <Link href="/doctors" className="btn-primary">
              Back to Doctors
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const nextSevenDays = getNextSevenDays();
  const selectedDayName = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const timeSlots = selectedDayName ? getDaySlots(selectedDayName) : [];

  return (
    <Layout title={`${doctor.name} - BM Healthcare`}>
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/doctors" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <FiArrowLeft className="mr-2" />
            Back to Doctors
          </Link>
        </div>
      </div>

      {/* Doctor Profile Section */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Doctor Image */}
              <div className="md:w-1/3 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center p-12">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center text-primary-600 text-7xl font-bold shadow-2xl">
                  {doctor.name.charAt(0)}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                  <p className="text-2xl text-primary-600 font-semibold mb-2">{doctor.specialization}</p>
                  <p className="text-gray-600 mb-4">{doctor.qualifications}</p>
                  
                  {doctor.rating > 0 && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < Math.floor(doctor.rating) ? 'fill-current' : ''} />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {doctor.rating} ({doctor.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <FiClock className="mr-3 text-primary-600" size={20} />
                    <span><strong>{doctor.experience}</strong> years experience</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiDollarSign className="mr-3 text-primary-600" size={20} />
                    <span><strong>₹{doctor.consultationFee}</strong> consultation fee</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center text-gray-700">
                      <FiPhone className="mr-3 text-primary-600" size={20} />
                      <a href={`tel:+91${doctor.phone}`} className="hover:text-primary-600">
                        +91 {doctor.phone}
                      </a>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center text-gray-700">
                      <FiMail className="mr-3 text-primary-600" size={20} />
                      <a href={`mailto:${doctor.email}`} className="hover:text-primary-600">
                        {doctor.email}
                      </a>
                    </div>
                  )}
                </div>

                {doctor.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book an Appointment</h2>

            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {nextSevenDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedTime('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDate === day.date
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium">{day.dayName}</div>
                    <div className="text-xs mt-1">{day.displayDate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTime === time
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-200 hover:border-primary-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No slots available for this day</p>
                )}
              </div>
            )}

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-primary-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Doctor:</strong> {doctor.name}</p>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || bookingLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </section>

      {/* Available Schedule */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Weekly Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSlots.map((slot, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-primary-600 mb-2">{slot.day}</h3>
                <div className="flex items-center text-gray-700">
                  <FiClock className="mr-2" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {slot.slotDuration} min slots
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
