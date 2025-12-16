import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUserCheck, FiCalendar, FiUsers, FiClipboard, FiPhone, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ReceptionistLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, true);
      
      if (result.success && result.user) {
        // Check if user is actually a receptionist or admin
        if (result.user.role === 'receptionist' || result.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          toast.error('Access denied. Receptionist credentials required.');
          logout();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const receptionistFeatures = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: 'Appointment Management',
      description: 'Schedule, modify, and manage patient appointments'
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Patient Registration',
      description: 'Register new patients and update patient information'
    },
    {
      icon: <FiClipboard className="w-6 h-6" />,
      title: 'Check-in System',
      description: 'Handle patient check-ins and queue management'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Communication Hub',
      description: 'Send appointment reminders and notifications'
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: 'Report Access',
      description: 'View and manage diagnostic test reports'
    },
    {
      icon: <FiUserCheck className="w-6 h-6" />,
      title: 'Front Desk Operations',
      description: 'Complete front desk management capabilities'
    }
  ];

  return (
    <Layout title="Receptionist Login - BM Healthcare">
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Receptionist Features */}
            <div className="hidden md:block">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-teal-600 p-3 rounded-lg">
                    <FiUserCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">Receptionist Portal</h1>
                    <p className="text-gray-600 mt-1">Front Desk Management</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">
                  Access the receptionist dashboard to manage appointments, patient registrations, and front desk operations.
                </p>
              </div>

              <div className="space-y-4">
                {receptionistFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-teal-600 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <FiUserCheck className="w-8 h-8 text-teal-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Receptionist Login</h2>
                  <p className="text-gray-600 mt-2">Sign in to access the front desk dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Receptionist Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="receptionist@bmhealthcare.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FiEye className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link href="/forgot-password" className="text-teal-600 hover:text-teal-700 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in as Receptionist'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Other login options</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Patient Login
                    </Link>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure receptionist access with encrypted authentication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
