import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, FiCalendar, FiFileText, FiSearch, FiPlus, FiEdit, 
  FiTrash2, FiEye, FiPhone, FiMail, FiMapPin, FiActivity,
  FiClock, FiCheckCircle, FiXCircle, FiBarChart2, FiDollarSign
} from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard statistics
      const appointmentsRes = await api.get('/appointments').catch(() => ({ data: [] }));
      const usersRes = await api.get('/users').catch(() => ({ data: [] }));
      
      const appointments = appointmentsRes.data || [];
      const users = usersRes.data || [];
      
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );

      setStats({
        todayAppointments: todayAppointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
        totalPatients: users.filter(u => u.role === 'user').length,
        todayTests: todayAppointments.filter(apt => apt.type === 'test').length
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
    { id: 'patients', label: 'Patient Registration', icon: <FiUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 /> }
  ];

  return (
    <Layout title="Receptionist Dashboard - BM Healthcare">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">Receptionist Dashboard</h1>
            <p className="text-teal-100">Welcome back, {user?.name || 'Receptionist'}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b sticky top-16 z-40">
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
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors || data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedPatient || !appointmentDate || !appointmentTime) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        patientId: selectedPatient._id,
        appointmentDate,
        appointmentTime,
        type: 'doctor'
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setAppointmentDate('');
      setAppointmentTime('');
    } catch (error) {
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor
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
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Phone/ID
            </label>
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Enter patient phone or ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date
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
              Appointment Time
            </label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <button
          onClick={handleBookAppointment}
          disabled={loading}
          className="mt-6 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
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
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data } = await api.get('/tests');
      setTests(data.tests || data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleBookTest = async () => {
    if (!selectedTest || !selectedPatient || !testDate || !testTime) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/appointments', {
        testId: selectedTest._id,
        patientId: selectedPatient._id,
        appointmentDate: testDate,
        appointmentTime: testTime,
        homeCollection,
        type: 'test'
      });
      toast.success('Test booked successfully!');
      setSelectedTest(null);
      setSelectedPatient(null);
      setTestDate('');
      setTestTime('');
      setHomeCollection(false);
    } catch (error) {
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Test
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Phone/ID
            </label>
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Enter patient phone or ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Test Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Date
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
              Test Time
            </label>
            <input
              type="time"
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
        </div>

        <button
          onClick={handleBookTest}
          disabled={loading}
          className="mt-6 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointmentsList();
  }, [appointments, searchTerm, filterStatus, filterDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/appointments');
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointmentsList = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.testName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    if (filterDate) {
      filtered = filtered.filter(apt =>
        new Date(apt.appointmentDate).toISOString().split('T')[0] === filterDate
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.delete(`/appointments/${appointmentId}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Management</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, or test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

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
            No appointments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{apt.patientName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{apt.patientPhone || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {apt.type === 'doctor' ? apt.doctorName : apt.testName}
                      </div>
                      <div className="text-xs text-gray-500">{apt.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{apt.appointmentTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
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
                        onClick={() => handleCancelAppointment(apt._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
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
      const { data } = await api.get('/users');
      const patientsList = (data || []).filter(u => u.role === 'user');
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
      await api.put(`/users/${selectedPatient._id}`, formData);
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
          <button className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-6 py-4 rounded-lg hover:bg-teal-700 transition-colors">
            <FiPlus />
            <span>New Patient</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors">
            <FiCalendar />
            <span>Book Appointment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors">
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
      const { data } = await api.get('/appointments');
      const appointments = data || [];

      // Calculate analytics
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate) >= (dateRange === 'week' ? weekAgo : monthAgo)
      );

      // Count by status
      const statusCounts = {
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length
      };

      // Calculate revenue
      const revenue = appointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.amount || a.consultationFee || 0), 0);

      setAnalytics({
        weeklyAppointments: recentAppointments,
        monthlyRevenue: revenue,
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
