import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiCreditCard, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        tests: cart.map((item) => ({
          test: item._id,
          quantity: item.quantity,
        })),
        totalAmount: getCartTotal(),
        paymentMethod,
        patientInfo: formData,
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/test-bookings`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Booking confirmed successfully!');
        clearCart();
        router.push(`/dashboard?booking=${response.data.booking._id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout title="Checkout - BM Healthcare">
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">Add some tests to your cart to checkout!</p>
              <Link href="/tests" className="btn-primary inline-block">
                Browse Tests
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout - BM Healthcare">
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FiMapPin className="mr-2" />
                    Address Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        required
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field resize-none"
                        placeholder="Enter your complete address"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={formData.pincode}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Date & Time */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Preferred Appointment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        required
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <select
                        name="appointmentTime"
                        required
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select Time</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="19:00">07:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Pay Online</div>
                        <div className="text-sm text-gray-600">
                          Pay securely using UPI, Cards, Net Banking, or Wallets
                        </div>
                      </div>
                      {paymentMethod === 'online' && (
                        <FiCheckCircle className="text-primary-500" size={24} />
                      )}
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="centre"
                        checked={paymentMethod === 'centre'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Pay at Diagnostic Centre</div>
                        <div className="text-sm text-gray-600">
                          Pay when you visit the diagnostic centre
                        </div>
                      </div>
                      {paymentMethod === 'centre' && (
                        <FiCheckCircle className="text-primary-500" size={24} />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Charges</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary-500">₹{getCartTotal()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Processing...' : paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Booking'}
                  </button>

                  <Link
                    href="/cart"
                    className="btn-outline w-full mt-3 flex items-center justify-center"
                  >
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
