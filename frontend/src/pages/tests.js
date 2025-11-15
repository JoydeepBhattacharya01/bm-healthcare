import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { FiSearch, FiFilter, FiClock, FiHome, FiFileText, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchTests();
    fetchCategories();
  }, [selectedCategory]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      
      const { data } = await api.get('/tests', { params });
      setTests(data.tests || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      // Show sample data if backend is not available
      setTests([
        {
          _id: '1',
          name: 'Complete Blood Count (CBC)',
          description: 'Comprehensive blood test to check overall health and detect disorders',
          category: 'Blood Test',
          price: 300,
          preparationInstructions: 'No special preparation required',
          reportDeliveryTime: '6 hours',
          isHomeCollectionAvailable: true,
          homeCollectionCharge: 50,
          parameters: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count']
        },
        {
          _id: '2',
          name: 'Lipid Profile',
          description: 'Test to measure cholesterol and triglycerides levels',
          category: 'Blood Test',
          price: 500,
          preparationInstructions: '12-14 hours fasting required',
          reportDeliveryTime: '12 hours',
          isHomeCollectionAvailable: true,
          homeCollectionCharge: 50,
          parameters: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides']
        },
        {
          _id: '3',
          name: 'Thyroid Profile',
          description: 'Complete thyroid function test',
          category: 'Blood Test',
          price: 600,
          preparationInstructions: 'No fasting required',
          reportDeliveryTime: '24 hours',
          isHomeCollectionAvailable: true,
          homeCollectionCharge: 50,
          parameters: ['T3', 'T4', 'TSH']
        },
        {
          _id: '4',
          name: 'Basic Health Checkup Package',
          description: 'Comprehensive health checkup',
          category: 'Health Package',
          price: 1500,
          preparationInstructions: '12 hours fasting required',
          reportDeliveryTime: '24 hours',
          isHomeCollectionAvailable: true,
          homeCollectionCharge: 100,
          parameters: ['CBC', 'Blood Sugar', 'Lipid Profile', 'LFT', 'KFT']
        }
      ]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/tests/categories/list');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['Blood Test', 'Urine Test', 'Imaging', 'Health Package', 'Cardiac']);
    }
  };

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Diagnostic Tests - BM Healthcare">
      {/* Page Header */}
      <PageHeader 
        title="Diagnostic Tests"
        subtitle="Comprehensive lab tests with accurate results"
        backgroundImage="/images/test.jpeg"
      />

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
              />
            </div>

            {/* Filter by Category */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tests List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No tests found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div key={test._id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{test.name}</h3>
                      <span className="badge badge-info">{test.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-500">₹{test.price}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2 flex-shrink-0" />
                      <span>Report in {test.reportDeliveryTime}</span>
                    </div>
                    {test.isHomeCollectionAvailable && (
                      <div className="flex items-center text-green-600">
                        <FiHome className="mr-2 flex-shrink-0" />
                        <span>Home collection available (+₹{test.homeCollectionCharge})</span>
                      </div>
                    )}
                    {test.preparationInstructions && (
                      <div className="flex items-start text-gray-600">
                        <FiFileText className="mr-2 flex-shrink-0 mt-1" />
                        <span className="line-clamp-2">{test.preparationInstructions}</span>
                      </div>
                    )}
                  </div>

                  {test.parameters && test.parameters.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Parameters ({test.parameters.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {test.parameters.slice(0, 3).map((param, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {param}
                          </span>
                        ))}
                        {test.parameters.length > 3 && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            +{test.parameters.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/tests/${test._id}`}
                      className="flex-1 btn-outline text-center text-sm py-2"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(test)}
                      className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-secondary-500 mb-4 flex justify-center">
                <FiClock size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
              <p className="text-gray-600">Get your reports quickly with SMS notifications</p>
            </div>
            <div className="text-center">
              <div className="text-secondary-500 mb-4 flex justify-center">
                <FiHome size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Home Collection</h3>
              <p className="text-gray-600">Sample collection at your doorstep</p>
            </div>
            <div className="text-center">
              <div className="text-secondary-500 mb-4 flex justify-center">
                <FiFileText size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">NABL Certified</h3>
              <p className="text-gray-600">Accurate results from certified labs</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
