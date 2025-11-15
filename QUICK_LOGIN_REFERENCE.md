# 🔐 Quick Login Reference

## 🌐 Unified Login URL
```
http://localhost:3000/login
(Same URL for ALL users - Patient, Admin, Receptionist)
```

## Test Account Credentials

### 👨‍💼 Admin Accounts
```
Select Role: Admin (Indigo button)

Account 1:
Email:    admin@bmhealthcare.com
Password: admin123

Account 2 (Custom):
Email:    admin1@gmail.com
Password: admin123
```

### 👩‍💼 Receptionist Accounts
```
Select Role: Receptionist (Teal button)

Account 1:
Email:    receptionist@bmhealthcare.com
Password: receptionist123

Account 2 (Custom):
Email:    recep1@gmail.com
Password: recep1@gmail.com
```

### 👤 Patient
```
Select Role: Patient (Blue button)

Email:    john@example.com
Password: user123
```

---

## 🎯 Quick Test Scenarios

### Scenario 1: Book an Appointment (Patient)
1. Login as patient
2. Go to Doctors page
3. Select Dr. Amit Patel (General Physician)
4. Choose available slot
5. Complete booking

### Scenario 2: Manage Appointment (Receptionist)
1. Login as receptionist
2. View all appointments
3. Check-in a patient
4. Reschedule if needed

### Scenario 3: System Management (Admin)
1. Login as admin
2. View dashboard analytics
3. Add/edit doctors
4. Manage users
5. Configure system settings

---

## 🔄 Reset Command
```bash
cd backend && npm run seed
```
