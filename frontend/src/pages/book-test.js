import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiMapPin, FiCheck, FiShoppingCart, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatTime12Hour, generateTimeSlots } from '../utils/timeUtils';

export default function BookTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    patientName: '',
    patientMobile: '',
    patientEmail: '',
    bookingDate: '',
    bookingTime: '',
    collectionType: 'walkin',
    collectionAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${API_URL}/tests`);
      setTests(response.data.tests || response.data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        collectionAddress: {
          ...formData.collectionAddress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };


  const calculateTotal = () => {
    if (!selectedTest) return 0;
    let total = selectedTest.price;
    if (formData.collectionType === 'home' && selectedTest.isHomeCollectionAvailable) {
      total += selectedTest.homeCollectionCharge || 0;
    }
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTest) {
      toast.error('Please select a test');
      return;
    }

    if (!formData.patientName || !formData.patientMobile || !formData.bookingDate || !formData.bookingTime) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.patientMobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formData.collectionType === 'home') {
      if (!formData.collectionAddress.street || !formData.collectionAddress.city) {
        toast.error('Please provide collection address for home collection');
        return;
      }
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await axios.post(`${API_URL}/bookings/tests`, {
        patientName: formData.patientName,
        patientMobile: formData.patientMobile,
        patientEmail: formData.patientEmail,
        tests: [{ test: selectedTest._id }],
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        collectionType: formData.collectionType,
        collectionAddress: formData.collectionType === 'home' ? formData.collectionAddress : null,
        notes: formData.notes
      });

      setBookingId(response.data.bookingId);
      setBookingSuccess(true);
      toast.success('Test booking confirmed!');
    } catch (error) {
      console.error('Error booking test:', error);
      toast.error(error.response?.data?.message || 'Failed to book test');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(tests.map(t => t.category))];

  const filteredTests = tests.filter(test => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && test.isActive;
  });

  const timeSlots = generateTimeSlots(8, 20, 30);

  if (bookingSuccess) {
    return (
      <Layout title="Booking Confirmed - BM Healthcare">
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 pt-28">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Test Booking Confirmed!</h1>
              <p className="text-lg text-slate-600 mb-6">
                Your test booking has been confirmed successfully.
              </p>
              <div className="bg-primary-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-600 mb-2">Your Booking ID</p>
                <p className="text-3xl font-bold text-primary-600">{bookingId}</p>
                <p className="text-sm text-slate-500 mt-2">Save this ID to check your booking status</p>
              </div>
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3">
                  <FiUser className="text-primary-600" />
                  <div>
                    <p className="text-sm text-slate-500">Patient Name</p>
                    <p className="font-medium text-slate-900">{formData.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-primary-600" />
                  <div>
                    <p className="text-sm text-slate-500">Collection Date & Time</p>
                    <p className="font-medium text-slate-900">
                      {new Date(formData.bookingDate).toLocaleDateString()} at {formatTime12Hour(formData.bookingTime)}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-2">Test Booked</p>
                  <p className="font-medium text-slate-900">• {selectedTest?.name}</p>
                  <p className="text-lg font-bold text-primary-600 mt-3">Total: ₹{calculateTotal()}</p>
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
    <Layout title="Book Lab Test - BM Healthcare">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 pt-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Lab Test</h1>
            <p className="text-lg text-slate-600">Select tests and schedule your sample collection</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Booking Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Book Lab Test</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Test Selection Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Select Test <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedTest?._id || ''}
                      onChange={(e) => {
                        const test = tests.find(t => t._id === e.target.value);
                        setSelectedTest(test);
                      }}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose a test...</option>
                      {tests.filter(t => t.isActive).map((test) => (
                        <option key={test._id} value={test._id}>
                          {test.name} - ₹{test.price}
                        </option>
                      ))}
                    </select>
                    {selectedTest && (
                      <div className="mt-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <h4 className="font-semibold text-slate-900 mb-2">{selectedTest.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{selectedTest.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{selectedTest.category}</span>
                          <span className="text-lg font-bold text-primary-600">₹{selectedTest.price}</span>
                        </div>
                        {selectedTest.isHomeCollectionAvailable && (
                          <p className="text-xs text-green-600 mt-2">✓ Home collection available (+₹{selectedTest.homeCollectionCharge || 0})</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                      <input
                        type="tel"
                        name="patientMobile"
                        value={formData.patientMobile}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Collection Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 pointer-events-none" />
                      <input
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Collection Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 pointer-events-none" />
                      <select
                        name="bookingTime"
                        value={formData.bookingTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 appearance-none cursor-pointer text-sm sm:text-base"
                        required
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                      Collection Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 pointer-events-none" />
                      <select
                        name="collectionType"
                        value={formData.collectionType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 appearance-none cursor-pointer text-sm sm:text-base"
                        required
                      >
                        <option value="walkin">Walk-in at Center</option>
                        <option value="home">Home Sample Collection</option>
                      </select>
                    </div>
                  </div>

                  {formData.collectionType === 'home' && (
                    <div className="space-y-2 sm:space-y-3 p-3 sm:p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-2 sm:mb-3">Home Collection Address</p>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.collectionAddress.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400"
                        placeholder="Street Address *"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <input
                          type="text"
                          name="address.city"
                          value={formData.collectionAddress.city}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                          placeholder="City *"
                          required
                        />
                        <input
                          type="text"
                          name="address.pincode"
                          value={formData.collectionAddress.pincode}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Total Amount</span>
                      <span className="text-primary-600">₹{calculateTotal()}</span>
                    </div>
                  </div>

                  {!selectedTest && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 sm:p-4 text-center">
                      <p className="text-amber-800 font-medium text-xs sm:text-sm">Please select a test to continue</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !selectedTest}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Processing Booking...' : 'Confirm Test Booking'}
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
