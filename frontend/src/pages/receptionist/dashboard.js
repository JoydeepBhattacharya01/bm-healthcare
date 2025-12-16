import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, FiCalendar, FiFileText, FiSearch, FiPlus, FiEdit, 
  FiTrash2, FiEye, FiPhone, FiMail, FiMapPin, FiActivity,
  FiClock, FiCheckCircle, FiXCircle, FiBarChart2, FiDollarSign, FiX
} from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatTime12Hour, generateTimeSlots } from '../../utils/timeUtils';

export default function ReceptionistDashboard() {
  const { user, isAuthenticated, isReceptionist, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State for different sections
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    todayTests: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/receptionist/login');
      return;
    }

    if (!isReceptionist && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, isReceptionist, isAdmin]);

  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };
    
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Use dedicated stats endpoint for better performance
      const { data } = await api.get('/reception/stats').catch(() => ({ 
        data: {
          todayAppointments: 0,
          pendingAppointments: 0,
          totalBookingsToday: 0,
          todayTestBookings: 0
        }
      }));
      
      setStats({
        todayAppointments: data.todayAppointments || 0,
        pendingAppointments: data.pendingAppointments || 0,
        totalPatients: 0, // Not critical for overview
        todayTests: data.todayTestBookings || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
    { id: 'book-doctor', label: 'Book Doctor', icon: <FiCalendar /> },
    { id: 'book-test', label: 'Book Test', icon: <FiFileText /> },
    { id: 'appointments', label: 'Appointments', icon: <FiCalendar /> },
    { id: 'manage-doctors', label: 'Manage Doctors', icon: <FiUsers /> },
    { id: 'manage-tests', label: 'Manage Tests', icon: <FiFileText /> },
    { id: 'patients', label: 'Patient Registration', icon: <FiUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 /> }
  ];

  return (
    <Layout title="Receptionist Dashboard - BM Healthcare">
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">Receptionist Dashboard</h1>
            <p className="text-teal-100">Welcome back, {user?.name || 'Receptionist'}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab stats={stats} />}
              {activeTab === 'book-doctor' && <BookDoctorTab />}
              {activeTab === 'book-test' && <BookTestTab />}
              {activeTab === 'appointments' && <AppointmentsTab />}
              {activeTab === 'manage-doctors' && <ManageDoctorsTab />}
              {activeTab === 'manage-tests' && <ManageTestsTab />}
              {activeTab === 'patients' && <PatientsTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Book Doctor Tab Component
function BookDoctorTab() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Patient search functionality
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (patientSearch.length >= 2) {
      const filtered = patients.filter(p => 
        p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.phone?.includes(patientSearch)
      );
      setFilteredPatients(filtered);
      setShowPatientDropdown(filtered.length > 0);
    } else {
      setFilteredPatients([]);
      setShowPatientDropdown(false);
    }
  }, [patientSearch, patients]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors || data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };
  
  const fetchPatients = async () => {
    try {
      const response = await api.get('/users');
      
      // Handle different response structures
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data && typeof response.data === 'object') {
        // If data is an object, try to find an array property
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            usersList = response.data[key];
            break;
          }
        }
      }
      
      const patientsList = usersList.filter(u => u.role === 'user');
      if (patientsList.length > 0) {
      }
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };
  
  const selectPatient = (patient) => {
    setPatientName(patient.name || '');
    setPatientMobile(patient.phone || '');
    setPatientEmail(patient.email || '');
    setPatientSearch('');
    setShowPatientDropdown(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    if (!patientName || !patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    if (!patientMobile || !patientMobile.trim()) {
      toast.error('Please enter patient mobile number');
      return;
    }
    if (!/^[0-9]{10}$/.test(patientMobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!appointmentDate) {
      toast.error('Please select appointment date');
      return;
    }
    if (!appointmentTime) {
      toast.error('Please select appointment time');
      return;
    }

    try {
      setLoading(true);
      const appointmentData = {
        patientName: patientName.trim(),
        patientMobile: patientMobile.trim(),
        patientEmail: patientEmail.trim() || '',
        doctor: selectedDoctor._id,
        appointmentDate,
        appointmentTime,
        symptoms: symptoms.trim() || ''
      };
      
      const response = await api.post('/reception/appointments', appointmentData);
      
      toast.success(`Appointment booked successfully! Booking ID: ${response.data.bookingId}`);
      
      setSelectedDoctor(null);
      setPatientName('');
      setPatientMobile('');
      setPatientEmail('');
      setAppointmentDate('');
      setAppointmentTime('');
      setSymptoms('');
    } catch (error) {
      console.error('Appointment booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Doctor Appointment</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor *
            </label>
            <select
              value={selectedDoctor?._id || ''}
              onChange={(e) => {
                const doctor = doctors.find(d => d._id === e.target.value);
                setSelectedDoctor(doctor);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization} (₹{doctor.consultationFee})
                </option>
              ))}
            </select>
          </div>

          {/* Patient Search */}
          <div className="lg:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Registered Patient (Optional)
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Type name or mobile to search registered patients..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-blue-50"
              />
            </div>
            {showPatientDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient._id}
                    type="button"
                    onClick={() => selectPatient(patient)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiPhone className="mr-1" size={12} />
                      {patient.phone} • {patient.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {patientSearch && filteredPatients.length === 0 && patientSearch.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                No registered patients found. Enter details manually below.
              </div>
            )}
          </div>

          <div className="lg:col-span-2 border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Or enter patient details manually:</strong>
            </p>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Patient Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Mobile Number *
            </label>
            <input
              type="tel"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Patient Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Email (Optional)
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="Enter patient email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Symptoms (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms (Optional)
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Brief description of symptoms"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date *
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Time *
            </label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select time slot</option>
              {generateTimeSlots(8, 20, 30).map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleBookAppointment}
          disabled={loading}
          className="mt-6 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}

// Book Test Tab Component
function BookTestTab() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Patient search functionality
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    fetchTests();
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (patientSearch.length >= 2) {
      const filtered = patients.filter(p => 
        p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.phone?.includes(patientSearch)
      );
      setFilteredPatients(filtered);
      setShowPatientDropdown(filtered.length > 0);
    } else {
      setFilteredPatients([]);
      setShowPatientDropdown(false);
    }
  }, [patientSearch, patients]);

  const fetchTests = async () => {
    try {
      const { data } = await api.get('/tests');
      setTests(data.tests || data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    }
  };
  
  const fetchPatients = async () => {
    try {
      const response = await api.get('/users');
      
      // Handle different response structures
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data && typeof response.data === 'object') {
        // If data is an object, try to find an array property
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            usersList = response.data[key];
            break;
          }
        }
      }
      
      const patientsList = usersList.filter(u => u.role === 'user');
      if (patientsList.length > 0) {
      }
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };
  
  const selectPatient = (patient) => {
    setPatientName(patient.name || '');
    setPatientMobile(patient.phone || '');
    setPatientEmail(patient.email || '');
    setPatientSearch('');
    setShowPatientDropdown(false);
  };

  const handleBookTest = async () => {
    if (!selectedTest) {
      toast.error('Please select a test');
      return;
    }
    if (!patientName || !patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    if (!patientMobile || !patientMobile.trim()) {
      toast.error('Please enter patient mobile number');
      return;
    }
    if (!/^[0-9]{10}$/.test(patientMobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!testDate) {
      toast.error('Please select test date');
      return;
    }
    if (!testTime) {
      toast.error('Please select test time');
      return;
    }
    if (homeCollection && !collectionAddress.trim()) {
      toast.error('Please enter collection address for home service');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        patientName: patientName.trim(),
        patientMobile: patientMobile.trim(),
        patientEmail: patientEmail.trim() || '',
        tests: [{ test: selectedTest._id }],
        bookingDate: testDate,
        bookingTime: testTime,
        collectionType: homeCollection ? 'home' : 'walkin',
        collectionAddress: homeCollection ? collectionAddress.trim() : ''
      };
      
      const response = await api.post('/reception/test-bookings', bookingData);
      
      toast.success(`Test booked successfully! Booking ID: ${response.data.bookingId}`);
      
      setSelectedTest(null);
      setPatientName('');
      setPatientMobile('');
      setPatientEmail('');
      setTestDate('');
      setTestTime('');
      setHomeCollection(false);
      setCollectionAddress('');
    } catch (error) {
      console.error('Test booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Diagnostic Test</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Test *
            </label>
            <select
              value={selectedTest?._id || ''}
              onChange={(e) => {
                const test = tests.find(t => t._id === e.target.value);
                setSelectedTest(test);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Choose a test...</option>
              {tests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.name} - ₹{test.price}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Search */}
          <div className="lg:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Registered Patient (Optional)
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Type name or mobile to search registered patients..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-blue-50"
              />
            </div>
            {showPatientDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient._id}
                    type="button"
                    onClick={() => selectPatient(patient)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiPhone className="mr-1" size={12} />
                      {patient.phone} • {patient.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {patientSearch && filteredPatients.length === 0 && patientSearch.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                No registered patients found. Enter details manually below.
              </div>
            )}
          </div>

          <div className="lg:col-span-2 border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Or enter patient details manually:</strong>
            </p>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Patient Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Mobile Number *
            </label>
            <input
              type="tel"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Patient Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Email (Optional)
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="Enter patient email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Test Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Date *
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Test Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Time *
            </label>
            <select
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select time slot</option>
              {generateTimeSlots(8, 20, 30).map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
          </div>

          {/* Home Collection */}
          <div className="lg:col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={homeCollection}
                onChange={(e) => setHomeCollection(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Home Collection Service
              </span>
            </label>
          </div>

          {/* Collection Address (shown only if home collection is selected) */}
          {homeCollection && (
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Address *
              </label>
              <textarea
                value={collectionAddress}
                onChange={(e) => setCollectionAddress(e.target.value)}
                placeholder="Enter full address for sample collection"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleBookTest}
          disabled={loading}
          className="mt-6 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? 'Booking...' : 'Book Test'}
        </button>
      </div>
    </div>
  );
}

// Appointments Tab Component
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    filterAppointmentsList();
  }, [appointments, searchTerm, filterStatus, filterDate, filterType]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      
      // Fetch both doctor appointments and test bookings in parallel
      const [appointmentsRes, testBookingsRes] = await Promise.all([
        api.get('/reception/appointments').catch(() => ({ data: { appointments: [] } })),
        api.get('/reception/test-bookings').catch(() => ({ data: { testBookings: [] } }))
      ]);
      
      const doctorAppointments = (appointmentsRes.data.appointments || []).map(apt => ({
        ...apt,
        type: 'doctor',
        bookingType: 'Doctor Appointment',
        serviceName: apt.doctor?.name || 'N/A',
        serviceDetails: apt.doctor?.specialization || '',
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        amount: apt.doctor?.consultationFee || 0,
        mobile: apt.patientMobile
      }));
      
      const testBookings = (testBookingsRes.data.testBookings || []).map(booking => ({
        ...booking,
        type: 'test',
        bookingType: 'Diagnostic Test',
        serviceName: booking.tests?.map(t => t.test?.name).filter(Boolean).join(', ') || 'N/A',
        serviceDetails: `${booking.tests?.length || 0} test(s) - ${booking.collectionType === 'home' ? 'Home Collection' : 'Walk-in'}`,
        date: booking.bookingDate,
        time: booking.bookingTime,
        amount: booking.totalAmount || 0,
        mobile: booking.patientMobile
      }));
      
      // Merge and sort by date and time (oldest first - chronological order)
      const allBookings = [...doctorAppointments, ...testBookings].sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        // If dates are same, sort by time
        return a.time.localeCompare(b.time);
      });
      
      setAppointments(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointmentsList = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patientName?.toLowerCase().includes(search) ||
        apt.serviceName?.toLowerCase().includes(search) ||
        apt.mobile?.includes(search) ||
        apt.bookingId?.toLowerCase().includes(search)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(apt => apt.type === filterType);
    }

    if (filterDate) {
      filtered = filtered.filter(apt =>
        new Date(apt.date).toISOString().split('T')[0] === filterDate
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (booking, newStatus) => {
    try {
      if (newStatus === booking.status) return;
      
      if (newStatus === 'confirmed') {
        const endpoint = booking.type === 'doctor' 
          ? `/reception/appointments/${booking._id}/confirm`
          : `/reception/test-bookings/${booking._id}/confirm`;
        await api.put(endpoint);
      } else if (newStatus === 'cancelled') {
        const endpoint = `/reception/appointments/${booking._id}/reject`;
        await api.put(endpoint, {
          cancellationReason: 'Cancelled by receptionist'
        });
      } else if (newStatus === 'completed') {
        if (booking.type === 'test') {
          await api.put(`/reception/test-bookings/${booking._id}/status`, { status: 'completed' });
        } else {
          await api.put(`/reception/appointments/${booking._id}/status`, { status: 'completed' });
        }
      } else {
        // For other statuses (pending, etc.)
        if (booking.type === 'test') {
          await api.put(`/reception/test-bookings/${booking._id}/status`, { status: newStatus });
        } else {
          await api.put(`/reception/appointments/${booking._id}/status`, { status: newStatus });
        }
      }
      
      toast.success('Status updated successfully');
      fetchAllBookings();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
      fetchAllBookings();
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!confirm(`Are you sure you want to cancel this ${booking.bookingType}?`)) return;

    try {
      const endpoint = `/reception/appointments/${booking._id}/reject`;
      
      await api.put(endpoint, {
        cancellationReason: 'Cancelled by receptionist'
      });
      
      toast.success('Booking cancelled successfully');
      fetchAllBookings();
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Management</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, test, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="doctor">Doctor Appointments</option>
            <option value="test">Test Bookings</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm mt-2">Try adjusting your filters or create a new booking</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-medium text-teal-600">
                        {booking.bookingId || 'N/A'}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        booking.type === 'doctor' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {booking.bookingType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.patientName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FiPhone className="mr-1" size={12} />
                        {booking.mobile || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.serviceName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.serviceDetails}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiCalendar className="mr-1" size={12} />
                        {new Date(booking.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FiClock className="mr-1" size={12} />
                        {formatTime12Hour(booking.time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{booking.amount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer border-0 ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Cancel booking"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Patients Tab Component
function PatientsTab() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      
      // Handle different response structures
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            usersList = response.data[key];
            break;
          }
        }
      }
      
      const patientsList = usersList.filter(u => u.role === 'user');
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.patientId?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        ...formData,
        gender: formData.gender ? formData.gender.toLowerCase() : '',
        role: 'user',
        password: 'patient123' // Default password
      });
      toast.success('Patient registered successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', age: '', gender: '', address: '' });
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register patient');
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedPatient._id}`, {
        ...formData,
        gender: formData.gender ? formData.gender.toLowerCase() : ''
      });
      toast.success('Patient updated successfully!');
      setShowEditModal(false);
      setSelectedPatient(null);
      setFormData({ name: '', email: '', phone: '', age: '', gender: '', address: '' });
      fetchPatients();
    } catch (error) {
      toast.error('Failed to update patient');
    }
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      age: patient.age || '',
      gender: patient.gender || '',
      address: patient.address || ''
    });
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Registration</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <FiPlus />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No patients found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age/Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {patient.patientId || patient._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.age || 'N/A'} / {patient.gender || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button
                        onClick={() => openEditModal(patient)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', email: '', phone: '', age: '', gender: '', address: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal - Similar structure */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Patient</h3>
            <form onSubmit={handleEditPatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
                  Update Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPatient(null);
                    setFormData({ name: '', email: '', phone: '', age: '', gender: '', address: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }) {
  const router = useRouter();
  
  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <FiCalendar className="w-8 h-8" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: <FiClock className="w-8 h-8" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <FiUsers className="w-8 h-8" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: "Today's Tests",
      value: stats.todayTests,
      icon: <FiFileText className="w-8 h-8" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  const handleQuickAction = (action) => {
    const tabMap = {
      'patients': 'patients',
      'book-doctor': 'book-doctor',
      'book-test': 'book-test'
    };
    
    const event = new CustomEvent('changeTab', { detail: tabMap[action] });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-lg ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('patients')}
            className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-6 py-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FiPlus />
            <span>New Patient</span>
          </button>
          <button 
            onClick={() => handleQuickAction('book-doctor')}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiCalendar />
            <span>Book Appointment</span>
          </button>
          <button 
            onClick={() => handleQuickAction('book-test')}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiFileText />
            <span>Book Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState({
    weeklyAppointments: [],
    monthlyRevenue: 0,
    topDoctors: [],
    topTests: [],
    appointmentsByStatus: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch both appointments and test bookings
      const [appointmentsRes, testBookingsRes] = await Promise.all([
        api.get('/reception/appointments').catch(() => ({ data: { appointments: [] } })),
        api.get('/reception/test-bookings').catch(() => ({ data: { testBookings: [] } }))
      ]);
      
      const appointments = appointmentsRes.data.appointments || [];
      const testBookings = testBookingsRes.data.testBookings || [];

      // Calculate analytics
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate) >= (dateRange === 'week' ? weekAgo : monthAgo)
      );
      
      const recentTests = testBookings.filter(booking => 
        new Date(booking.bookingDate) >= (dateRange === 'week' ? weekAgo : monthAgo)
      );

      // Count by status (combine both types)
      const statusCounts = {
        pending: appointments.filter(a => a.status === 'pending').length + 
                 testBookings.filter(t => t.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length + 
                   testBookings.filter(t => t.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length + 
                   testBookings.filter(t => t.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length + 
                   testBookings.filter(t => t.status === 'cancelled').length
      };

      // Calculate revenue from both appointments and test bookings
      const appointmentRevenue = appointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.doctor?.consultationFee || 0), 0);
      
      const testRevenue = testBookings
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      
      const totalRevenue = appointmentRevenue + testRevenue;

      // Merge recent activity
      const allRecent = [
        ...recentAppointments.map(apt => ({
          ...apt,
          type: 'doctor',
          date: apt.appointmentDate,
          time: apt.appointmentTime
        })),
        ...recentTests.map(booking => ({
          ...booking,
          type: 'test',
          date: booking.bookingDate,
          time: booking.bookingTime,
          patientName: booking.patientName
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setAnalytics({
        weeklyAppointments: allRecent,
        monthlyRevenue: totalRevenue,
        topDoctors: [],
        topTests: [],
        appointmentsByStatus: statusCounts
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAppointments = Object.values(analytics.appointmentsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Total Revenue</p>
                <h3 className="text-4xl font-bold">₹{analytics.monthlyRevenue.toLocaleString()}</h3>
                <p className="text-green-100 text-sm mt-2">From completed appointments</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <FiDollarSign className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Appointment Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <FiClock className="text-yellow-600" size={24} />
                  <span className="text-2xl font-bold text-yellow-600">
                    {analytics.appointmentsByStatus.pending}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Pending</p>
                <div className="mt-2 bg-yellow-200 h-2 rounded-full">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${totalAppointments ? (analytics.appointmentsByStatus.pending / totalAppointments * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <FiCheckCircle className="text-blue-600" size={24} />
                  <span className="text-2xl font-bold text-blue-600">
                    {analytics.appointmentsByStatus.confirmed}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <div className="mt-2 bg-blue-200 h-2 rounded-full">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${totalAppointments ? (analytics.appointmentsByStatus.confirmed / totalAppointments * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <FiCheckCircle className="text-green-600" size={24} />
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.appointmentsByStatus.completed}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Completed</p>
                <div className="mt-2 bg-green-200 h-2 rounded-full">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${totalAppointments ? (analytics.appointmentsByStatus.completed / totalAppointments * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <FiXCircle className="text-red-600" size={24} />
                  <span className="text-2xl font-bold text-red-600">
                    {analytics.appointmentsByStatus.cancelled}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <div className="mt-2 bg-red-200 h-2 rounded-full">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${totalAppointments ? (analytics.appointmentsByStatus.cancelled / totalAppointments * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analytics.weeklyAppointments.slice(0, 5).map((apt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      apt.status === 'completed' ? 'bg-green-500' :
                      apt.status === 'confirmed' ? 'bg-blue-500' :
                      apt.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {apt.patientName || 'Patient'} - {apt.type === 'doctor' ? apt.doctorName : apt.testName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
              {analytics.weeklyAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <FiActivity className="text-teal-600" size={32} />
                <span className="text-3xl font-bold text-gray-900">{totalAppointments}</span>
              </div>
              <h4 className="text-gray-600 font-medium">Total Appointments</h4>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <FiCalendar className="text-blue-600" size={32} />
                <span className="text-3xl font-bold text-gray-900">
                  {analytics.weeklyAppointments.length}
                </span>
              </div>
              <h4 className="text-gray-600 font-medium">Recent Appointments</h4>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <FiCheckCircle className="text-green-600" size={32} />
                <span className="text-3xl font-bold text-gray-900">
                  {totalAppointments ? Math.round((analytics.appointmentsByStatus.completed / totalAppointments) * 100) : 0}%
                </span>
              </div>
              <h4 className="text-gray-600 font-medium">Completion Rate</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Manage Doctors Tab Component
function ManageDoctorsTab() {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30 }
    ]
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors?isActive=all');
      setDoctors(data.doctors || data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const handleDelete = async (doctorId, doctorName) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/doctors/${doctorId}`);
      toast.success('Doctor deleted successfully!');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handleToggleAvailability = async (doctorId, currentStatus, doctorName) => {
    const newStatus = !currentStatus;
    const statusText = newStatus ? 'available (In)' : 'unavailable (Out)';
    
    try {
      await api.put(`/doctors/${doctorId}`, { isActive: newStatus });
      toast.success(`Dr. ${doctorName} marked as ${statusText}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error(error.response?.data?.message || 'Failed to update availability');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...formData.availableSlots];
    newSlots[index][field] = value;
    setFormData({ ...formData, availableSlots: newSlots });
  };

  const addSlot = () => {
    setFormData({
      ...formData,
      availableSlots: [
        ...formData.availableSlots,
        { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30 }
      ]
    });
  };

  const removeSlot = (index) => {
    const newSlots = formData.availableSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, availableSlots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      await api.post('/doctors', {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        consultationFee: parseInt(formData.consultationFee) || 0
      });

      toast.success('Doctor added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualifications: '',
        experience: '',
        consultationFee: '',
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30 }
        ]
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center gap-2"
        >
          <FiPlus /> Add New Doctor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                <button
                  onClick={() => handleDelete(doctor._id, doctor.name)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete doctor"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500 mt-1">{doctor.qualifications}</p>
              <p className="text-sm text-teal-600 font-medium mt-2">₹{doctor.consultationFee}</p>
              <p className="text-xs text-gray-500 mt-1">{doctor.experience} years experience</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {doctor.isActive ? '✓ In (Available)' : '✕ Out (Unavailable)'}
                </span>
                <button
                  onClick={() => handleToggleAvailability(doctor._id, doctor.isActive, doctor.name)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                    doctor.isActive 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                  title={doctor.isActive ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {doctor.isActive ? 'Mark Out' : 'Mark In'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {doctors.length === 0 && (
          <p className="text-center text-gray-500 py-8">No doctors found. Add your first doctor!</p>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Doctor</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="doctor@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Cardiologist"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="MBBS, MD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee (₹)
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Slots
                    </label>
                    <button
                      type="button"
                      onClick={addSlot}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                    >
                      <FiPlus /> Add Slot
                    </button>
                  </div>

                  {formData.availableSlots.map((slot, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Day</label>
                        <select
                          value={slot.day}
                          onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Time</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={slot.slotDuration}
                          onChange={(e) => handleSlotChange(index, 'slotDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          min="15"
                          step="15"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                          disabled={formData.availableSlots.length === 1}
                        >
                          <FiTrash2 className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Manage Tests Tab Component  
function ManageTestsTab() {
  const [tests, setTests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    preparationInstructions: '',
    reportDeliveryTime: '',
    isHomeCollectionAvailable: false,
    homeCollectionCharge: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data } = await api.get('/tests?isActive=all');
      setTests(data.tests || data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      await api.post('/tests', {
        ...formData,
        price: parseInt(formData.price) || 0,
        homeCollectionCharge: parseInt(formData.homeCollectionCharge) || 0
      });

      toast.success('Test added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        preparationInstructions: '',
        reportDeliveryTime: '',
        isHomeCollectionAvailable: false,
        homeCollectionCharge: ''
      });
      fetchTests();
    } catch (error) {
      console.error('Error adding test:', error);
      toast.error(error.response?.data?.message || 'Failed to add test');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId, testName) => {
    if (!confirm(`Are you sure you want to delete ${testName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/tests/${testId}`);
      toast.success('Test deleted successfully!');
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error(error.response?.data?.message || 'Failed to delete test');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Tests</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center gap-2"
        >
          <FiPlus /> Add New Test
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div key={test._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{test.name}</h3>
                <button
                  onClick={() => handleDeleteTest(test._id, test.name)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete test"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{test.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{test.category}</span>
              </div>
              <p className="text-sm text-teal-600 font-medium mt-2">₹{test.price}</p>
              {test.isHomeCollectionAvailable && (
                <p className="text-xs text-green-600 mt-1">Home Collection: +₹{test.homeCollectionCharge}</p>
              )}
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${test.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {test.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
        {tests.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tests found. Add your first test!</p>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Test</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Complete Blood Count (CBC)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Detailed description of the test"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Blood Test"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="500"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Instructions
                  </label>
                  <textarea
                    name="preparationInstructions"
                    value={formData.preparationInstructions}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Fasting required for 8-12 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Delivery Time
                  </label>
                  <input
                    type="text"
                    name="reportDeliveryTime"
                    value={formData.reportDeliveryTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="24 hours"
                  />
                </div>

                <div className="border-t pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isHomeCollectionAvailable"
                      checked={formData.isHomeCollectionAvailable}
                      onChange={handleChange}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Home Collection Available
                    </span>
                  </label>
                </div>

                {formData.isHomeCollectionAvailable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Collection Charge (₹)
                    </label>
                    <input
                      type="number"
                      name="homeCollectionCharge"
                      value={formData.homeCollectionCharge}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="50"
                      min="0"
                    />
                  </div>
                )}

                <div className="flex gap-4 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Test'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
