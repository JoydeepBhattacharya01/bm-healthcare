require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Test = require('../models/Test');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@bmhealthcare.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    gender: 'male',
    isActive: true
  },
  {
    name: 'Admin One',
    email: 'admin1@gmail.com',
    password: 'admin123',
    phone: '9876543213',
    role: 'admin',
    gender: 'male',
    isActive: true
  },
  {
    name: 'Receptionist User',
    email: 'receptionist@bmhealthcare.com',
    password: 'receptionist123',
    phone: '9876543211',
    role: 'receptionist',
    gender: 'female',
    isActive: true
  },
  {
    name: 'Receptionist One',
    email: 'recep1@gmail.com',
    password: 'recep1@gmail.com',
    phone: '9876543214',
    role: 'receptionist',
    gender: 'female',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    phone: '9876543212',
    role: 'user',
    gender: 'male',
    dateOfBirth: new Date('1990-01-15'),
    address: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    isActive: true
  }
];

// Sample Doctors
const doctors = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@bmhealthcare.com',
    phone: '9876543220',
    specialization: 'Cardiologist',
    qualifications: 'MBBS, MD (Cardiology), DM',
    experience: 15,
    consultationFee: 800,
    bio: 'Experienced cardiologist with expertise in heart diseases and interventional cardiology.',
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '13:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Tuesday', startTime: '09:00', endTime: '13:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Wednesday', startTime: '09:00', endTime: '13:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Thursday', startTime: '09:00', endTime: '13:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Friday', startTime: '09:00', endTime: '13:00', slotDuration: 30, maxAppointments: 1 }
    ],
    isActive: true
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@bmhealthcare.com',
    phone: '9876543221',
    specialization: 'Dermatologist',
    qualifications: 'MBBS, MD (Dermatology)',
    experience: 10,
    consultationFee: 600,
    bio: 'Specialist in skin care, hair treatment, and cosmetic dermatology.',
    availableSlots: [
      { day: 'Monday', startTime: '14:00', endTime: '18:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Wednesday', startTime: '14:00', endTime: '18:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Friday', startTime: '14:00', endTime: '18:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00', slotDuration: 30, maxAppointments: 1 }
    ],
    isActive: true
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@bmhealthcare.com',
    phone: '9876543222',
    specialization: 'General Physician',
    qualifications: 'MBBS, MD (Medicine)',
    experience: 12,
    consultationFee: 500,
    bio: 'General physician with expertise in treating common ailments and preventive care.',
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 20, maxAppointments: 1 },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDuration: 20, maxAppointments: 1 },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDuration: 20, maxAppointments: 1 },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', slotDuration: 20, maxAppointments: 1 },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', slotDuration: 20, maxAppointments: 1 },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', slotDuration: 20, maxAppointments: 1 }
    ],
    isActive: true
  },
  {
    name: 'Dr. Sneha Reddy',
    email: 'sneha.reddy@bmhealthcare.com',
    phone: '9876543223',
    specialization: 'Pediatrician',
    qualifications: 'MBBS, MD (Pediatrics)',
    experience: 8,
    consultationFee: 550,
    bio: 'Child specialist with focus on newborn care and childhood diseases.',
    availableSlots: [
      { day: 'Tuesday', startTime: '10:00', endTime: '14:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Thursday', startTime: '10:00', endTime: '14:00', slotDuration: 30, maxAppointments: 1 },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00', slotDuration: 30, maxAppointments: 1 }
    ],
    isActive: true
  }
];

// Sample Tests
const tests = [
  {
    name: 'Complete Blood Count (CBC)',
    description: 'Comprehensive blood test to check overall health and detect disorders',
    category: 'Blood Test',
    price: 300,
    preparationInstructions: 'No special preparation required. Can be done at any time.',
    reportDeliveryTime: '6 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'MCV', 'MCH', 'MCHC'],
    isActive: true
  },
  {
    name: 'Lipid Profile',
    description: 'Test to measure cholesterol and triglycerides levels',
    category: 'Blood Test',
    price: 500,
    preparationInstructions: '12-14 hours fasting required before test',
    reportDeliveryTime: '12 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'VLDL'],
    isActive: true
  },
  {
    name: 'Thyroid Profile (T3, T4, TSH)',
    description: 'Complete thyroid function test',
    category: 'Blood Test',
    price: 600,
    preparationInstructions: 'No fasting required',
    reportDeliveryTime: '24 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['T3', 'T4', 'TSH'],
    isActive: true
  },
  {
    name: 'HbA1c (Glycated Hemoglobin)',
    description: 'Test for long-term blood sugar control',
    category: 'Blood Test',
    price: 400,
    preparationInstructions: 'No fasting required',
    reportDeliveryTime: '24 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['HbA1c'],
    isActive: true
  },
  {
    name: 'Liver Function Test (LFT)',
    description: 'Test to check liver health and function',
    category: 'Blood Test',
    price: 550,
    preparationInstructions: '8-12 hours fasting recommended',
    reportDeliveryTime: '12 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['SGOT', 'SGPT', 'Bilirubin', 'Alkaline Phosphatase', 'Total Protein', 'Albumin'],
    isActive: true
  },
  {
    name: 'Kidney Function Test (KFT)',
    description: 'Test to assess kidney function',
    category: 'Blood Test',
    price: 500,
    preparationInstructions: 'No special preparation required',
    reportDeliveryTime: '12 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['Urea', 'Creatinine', 'Uric Acid', 'Sodium', 'Potassium'],
    isActive: true
  },
  {
    name: 'Vitamin D Test',
    description: 'Test to measure vitamin D levels',
    category: 'Blood Test',
    price: 800,
    preparationInstructions: 'No fasting required',
    reportDeliveryTime: '48 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['25-OH Vitamin D'],
    isActive: true
  },
  {
    name: 'Vitamin B12 Test',
    description: 'Test to measure vitamin B12 levels',
    category: 'Blood Test',
    price: 700,
    preparationInstructions: 'No fasting required',
    reportDeliveryTime: '48 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['Vitamin B12'],
    isActive: true
  },
  {
    name: 'Complete Urine Analysis',
    description: 'Comprehensive urine test',
    category: 'Urine Test',
    price: 200,
    preparationInstructions: 'Collect first morning urine sample',
    reportDeliveryTime: '6 hours',
    isHomeCollectionAvailable: false,
    homeCollectionCharge: 0,
    parameters: ['Physical Examination', 'Chemical Examination', 'Microscopic Examination'],
    isActive: true
  },
  {
    name: 'X-Ray Chest',
    description: 'Chest X-ray for lung and heart examination',
    category: 'Imaging',
    price: 400,
    preparationInstructions: 'No special preparation required',
    reportDeliveryTime: '2 hours',
    isHomeCollectionAvailable: false,
    homeCollectionCharge: 0,
    parameters: [],
    isActive: true
  },
  {
    name: 'ECG (Electrocardiogram)',
    description: 'Test to check heart rhythm and electrical activity',
    category: 'Cardiac',
    price: 300,
    preparationInstructions: 'No special preparation required',
    reportDeliveryTime: '1 hour',
    isHomeCollectionAvailable: false,
    homeCollectionCharge: 0,
    parameters: [],
    isActive: true
  },
  {
    name: 'Basic Health Checkup Package',
    description: 'Comprehensive health checkup including CBC, Blood Sugar, Lipid Profile, LFT, KFT',
    category: 'Health Package',
    price: 1500,
    preparationInstructions: '12 hours fasting required',
    reportDeliveryTime: '24 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 100,
    parameters: ['CBC', 'Blood Sugar', 'Lipid Profile', 'LFT', 'KFT'],
    isActive: true
  },
  {
    name: 'Diabetes Screening Package',
    description: 'Complete diabetes screening with HbA1c, Fasting & PP Blood Sugar',
    category: 'Health Package',
    price: 800,
    preparationInstructions: '12 hours fasting required',
    reportDeliveryTime: '24 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['HbA1c', 'Fasting Blood Sugar', 'PP Blood Sugar'],
    isActive: true
  }
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Test.deleteMany();

    console.log('Existing data cleared');

    // Hash passwords for users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Insert data
    await User.insertMany(users);
    await Doctor.insertMany(doctors);
    await Test.insertMany(tests);

    console.log('✅ Sample data imported successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('\n👨‍💼 ADMIN ACCOUNTS:');
    console.log('  • admin@bmhealthcare.com / admin123');
    console.log('  • admin1@gmail.com / admin123');
    console.log('\n👩‍💼 RECEPTIONIST ACCOUNTS:');
    console.log('  • receptionist@bmhealthcare.com / receptionist123');
    console.log('  • recep1@gmail.com / recep1@gmail.com');
    console.log('\n👤 PATIENT ACCOUNT:');
    console.log('  • john@example.com / user123');
    
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Doctor.deleteMany();
    await Test.deleteMany();

    console.log('✅ Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('  node src/utils/seeder.js -i  (Import sample data)');
  console.log('  node src/utils/seeder.js -d  (Delete all data)');
  process.exit();
}
