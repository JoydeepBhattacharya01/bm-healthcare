import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiCalendar, FiFileText, FiDollarSign, FiTrendingUp, FiActivity, FiShield, FiUserCheck } from 'react-icons/fi';
import api from '../../utils/api';

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isReceptionist } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalTests: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect receptionists to their dedicated dashboard
    if (isReceptionist && !isAdmin) {
      router.push('/receptionist/dashboard');
      return;
    }

    if (!isAdmin && !isReceptionist) {
      router.push('/dashboard');
      return;
    }

    fetchDashboardStats();
  }, [isAuthenticated, isAdmin, isReceptionist]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch various statistics
      // Note: You may need to create these API endpoints in the backend
      const [usersRes, doctorsRes, appointmentsRes, testsRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/doctors').catch(() => ({ data: [] })),
        api.get('/appointments').catch(() => ({ data: [] })),
        api.get('/tests').catch(() => ({ data: [] }))
      ]);

      const users = usersRes.data || [];
      const doctors = doctorsRes.data || [];
      const appointments = appointmentsRes.data || [];
      const tests = testsRes.data || [];

      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );

      setStats({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        totalTests: tests.length,
        todayAppointments: todayAppointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
        totalRevenue: appointments.reduce((sum, apt) => sum + (apt.amount || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers className="w-8 h-8" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <FiActivity className="w-8 h-8" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: <FiCalendar className="w-8 h-8" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: <FiCalendar className="w-8 h-8" />,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: <FiTrendingUp className="w-8 h-8" />,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: 'Completed Appointments',
      value: stats.completedAppointments,
      icon: <FiFileText className="w-8 h-8" />,
      color: 'teal',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      iconBg: 'bg-teal-100'
    },
    {
      title: 'Total Tests',
      value: stats.totalTests,
      icon: <FiFileText className="w-8 h-8" />,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign className="w-8 h-8" />,
      color: 'pink',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      iconBg: 'bg-pink-100'
    }
  ];

  const quickActions = isAdmin ? [
    { title: 'Manage Users', href: '/admin/users', icon: <FiUsers />, color: 'blue' },
    { title: 'Manage Doctors', href: '/admin/doctors', icon: <FiActivity />, color: 'green' },
    { title: 'View Appointments', href: '/admin/appointments', icon: <FiCalendar />, color: 'purple' },
    { title: 'Manage Tests', href: '/admin/tests', icon: <FiFileText />, color: 'indigo' },
    { title: 'View Reports', href: '/admin/reports', icon: <FiFileText />, color: 'teal' },
    { title: 'System Settings', href: '/admin/settings', icon: <FiShield />, color: 'orange' }
  ] : [
    { title: 'View Appointments', href: '/admin/appointments', icon: <FiCalendar />, color: 'purple' },
    { title: 'Register Patient', href: '/admin/patients/new', icon: <FiUsers />, color: 'blue' },
    { title: 'Book Test', href: '/admin/tests/book', icon: <FiFileText />, color: 'indigo' },
    { title: 'View Reports', href: '/admin/reports', icon: <FiFileText />, color: 'teal' }
  ];

  if (loading) {
    return (
      <Layout title="Dashboard - BM Healthcare">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${isAdmin ? 'Admin' : 'Receptionist'} Dashboard - BM Healthcare`}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {isAdmin ? (
                <FiShield className="w-8 h-8 text-indigo-600" />
              ) : (
                <FiUserCheck className="w-8 h-8 text-teal-600" />
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? 'Admin' : 'Receptionist'} Dashboard
              </h1>
            </div>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
              >
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className={`p-4 rounded-lg border-2 border-gray-200 hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all text-center group`}
                >
                  <div className={`text-${action.color}-600 mb-2 flex justify-center text-2xl`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <FiActivity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Activity tracking coming soon...</p>
              <p className="text-sm mt-2">Recent appointments, registrations, and updates will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
