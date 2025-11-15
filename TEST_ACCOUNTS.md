# 🧪 Test Accounts - BM Healthcare

Complete list of dummy accounts created for testing the application.

---

## 🔐 Login Credentials

### 1. Admin Accounts

**Access Level:** Full System Access

**Login URL:** http://localhost:3000/admin/login

#### Admin Account 1
- **Email:** `admin@bmhealthcare.com`
- **Password:** `admin123`
- **Name:** Admin User
- **Phone:** 9876543210

#### Admin Account 2 (Custom)
- **Email:** `admin1@gmail.com`
- **Password:** `admin123`
- **Name:** Admin One
- **Phone:** 9876543213

**Features Available:**
- ✅ User Management (Create, Read, Update, Delete all users)
- ✅ Doctor Management (Add, edit, remove doctors)
- ✅ Receptionist Management
- ✅ Appointment Control (View and manage all appointments)
- ✅ Report Management (Access all diagnostic reports)
- ✅ Test Management (Add, edit, remove diagnostic tests)
- ✅ Analytics Dashboard (System-wide statistics)
- ✅ System Settings & Configuration
- ✅ Payment Management
- ✅ Full Administrative Privileges

---

### 2. Receptionist Accounts

**Access Level:** Front Desk Operations

**Login URL:** http://localhost:3000/receptionist/login

#### Receptionist Account 1
- **Email:** `receptionist@bmhealthcare.com`
- **Password:** `receptionist123`
- **Name:** Receptionist User
- **Phone:** 9876543211

#### Receptionist Account 2 (Custom)
- **Email:** `recep1@gmail.com`
- **Password:** `recep1@gmail.com`
- **Name:** Receptionist One
- **Phone:** 9876543214

**Features Available:**
- ✅ Appointment Management (Schedule, modify, cancel)
- ✅ Patient Registration (Register new patients)
- ✅ Patient Information Updates
- ✅ Check-in System (Patient check-ins)
- ✅ Queue Management
- ✅ Communication Hub (Send reminders & notifications)
- ✅ Report Access (View and manage reports)
- ✅ Doctor Schedule Viewing
- ✅ Test Booking Management
- ✅ Front Desk Dashboard

---

### 3. Patient Account

**Access Level:** Patient Portal

**Login Details:**
- **Email:** `john@example.com`
- **Password:** `user123`
- **Login URL:** http://localhost:3000/login

**Features Available:**
- ✅ Book Doctor Appointments
- ✅ Book Diagnostic Tests
- ✅ View Appointment History
- ✅ View Test Reports
- ✅ Update Profile Information
- ✅ Payment Processing
- ✅ Download Reports
- ✅ View Doctor Profiles
- ✅ Browse Available Tests

**Profile Details:**
- Name: John Doe
- Phone: 9876543212
- Role: user
- Gender: Male
- Date of Birth: January 15, 1990
- Address: 123 Main St, Mumbai, Maharashtra - 400001
- Status: Active

---

## 🏥 Sample Doctors (Pre-loaded)

### 1. Dr. Rajesh Kumar
- **Specialization:** Cardiologist
- **Email:** rajesh.kumar@bmhealthcare.com
- **Phone:** 9876543220
- **Consultation Fee:** ₹800
- **Experience:** 15 years
- **Available:** Mon-Fri (9:00 AM - 1:00 PM)

### 2. Dr. Priya Sharma
- **Specialization:** Dermatologist
- **Email:** priya.sharma@bmhealthcare.com
- **Phone:** 9876543221
- **Consultation Fee:** ₹600
- **Experience:** 10 years
- **Available:** Mon, Wed, Fri (2:00 PM - 6:00 PM), Sat (10:00 AM - 2:00 PM)

### 3. Dr. Amit Patel
- **Specialization:** General Physician
- **Email:** amit.patel@bmhealthcare.com
- **Phone:** 9876543222
- **Consultation Fee:** ₹500
- **Experience:** 12 years
- **Available:** Mon-Sat (9:00 AM - 5:00 PM)

### 4. Dr. Sneha Reddy
- **Specialization:** Pediatrician
- **Email:** sneha.reddy@bmhealthcare.com
- **Phone:** 9876543223
- **Consultation Fee:** ₹550
- **Experience:** 8 years
- **Available:** Tue, Thu, Sat (10:00 AM - 2:00 PM)

---

## 🧬 Sample Diagnostic Tests (Pre-loaded)

### Blood Tests
1. **Complete Blood Count (CBC)** - ₹300
2. **Lipid Profile** - ₹500
3. **Thyroid Profile (T3, T4, TSH)** - ₹600
4. **HbA1c (Glycated Hemoglobin)** - ₹400
5. **Liver Function Test (LFT)** - ₹550
6. **Kidney Function Test (KFT)** - ₹500
7. **Vitamin D Test** - ₹800
8. **Vitamin B12 Test** - ₹700

### Other Tests
9. **Complete Urine Analysis** - ₹200
10. **X-Ray Chest** - ₹400
11. **ECG (Electrocardiogram)** - ₹300

### Health Packages
12. **Basic Health Checkup Package** - ₹1,500
13. **Diabetes Screening Package** - ₹800

---

## 🚀 Quick Testing Guide

### Testing Admin Features
1. Navigate to http://localhost:3000/admin/login
2. Login with admin credentials
3. Test user management, doctor management, system settings
4. View analytics dashboard
5. Manage appointments and reports

### Testing Receptionist Features
1. Navigate to http://localhost:3000/receptionist/login
2. Login with receptionist credentials
3. Register a new patient
4. Schedule appointments for patients
5. Manage check-ins and queue
6. Send appointment reminders

### Testing Patient Features
1. Navigate to http://localhost:3000/login
2. Login with patient credentials
3. Browse doctors and book appointments
4. Browse tests and add to cart
5. Complete payment process
6. View appointment history and reports

---

## 🔄 Reset Test Data

To reset all test data and recreate dummy accounts:

```bash
# Delete all existing data
cd backend
npm run seed:delete

# Import fresh sample data
npm run seed
```

---

## 📝 Notes

- All passwords are simple for testing purposes only
- In production, use strong passwords and proper security measures
- The seeder clears all existing data before importing
- Home collection is available for most blood tests (₹50 extra charge)
- All accounts are active and ready to use
- MongoDB must be connected for seeding to work

---

## 🔗 Quick Access Links

- **Admin Login:** http://localhost:3000/admin/login
- **Receptionist Login:** http://localhost:3000/receptionist/login
- **Patient Login:** http://localhost:3000/login
- **Registration:** http://localhost:3000/register
- **Home Page:** http://localhost:3000

---

## 🆘 Troubleshooting

**Issue:** Cannot login with test credentials
- **Solution:** Run `npm run seed` in the backend directory to recreate accounts

**Issue:** "User not found" error
- **Solution:** Ensure MongoDB is connected and seeder has been run

**Issue:** Role-based access not working
- **Solution:** Clear browser cookies and login again

**Issue:** Backend not responding
- **Solution:** Ensure backend server is running on port 5001

---

**Last Updated:** November 8, 2025
**Status:** ✅ All test accounts active and functional
