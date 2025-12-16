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
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors || data || []);
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

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500 mt-1">{doctor.qualifications}</p>
              <p className="text-sm text-teal-600 font-medium mt-2">₹{doctor.consultationFee}</p>
              <p className="text-xs text-gray-500 mt-1">{doctor.experience} years experience</p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
        {doctors.length === 0 && (
          <p className="text-center text-gray-500 py-8">No doctors found. Add your first doctor!</p>
        )}
      </div>

      {/* Add Doctor Modal */}
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

                {/* Available Slots */}
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
      const { data } = await api.get('/tests');
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

      {/* Tests List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div key={test._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-gray-900">{test.name}</h3>
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

      {/* Add Test Modal */}
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

export { ManageDoctorsTab, ManageTestsTab };
