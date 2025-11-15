# 🔐 Unified Login System

## Overview

BM Healthcare now uses a **single unified login page** for all user types (Patients, Admin, and Receptionists). No more separate login pages!

---

## 📍 Login URL

**One URL for Everyone:**
```
http://localhost:3000/login
```

---

## 🎯 How It Works

### Step 1: Select Your Role
When you visit the login page, you'll see three role options:
- **Patient** (Blue) - For booking appointments and viewing reports
- **Admin** (Indigo) - For system management
- **Receptionist** (Teal) - For front desk operations

### Step 2: Enter Credentials
- Enter your email address
- Enter your password

### Step 3: Login
- Click the "Login" button
- The system automatically redirects you based on your account role

---

## 🔑 Test Accounts

### Patient Login
```
Role:     Select "Patient"
Email:    john@example.com
Password: user123
```

### Admin Login
```
Role:     Select "Admin"
Email:    admin1@gmail.com
Password: admin123
```
OR
```
Email:    admin@bmhealthcare.com
Password: admin123
```

### Receptionist Login
```
Role:     Select "Receptionist"
Email:    recep1@gmail.com
Password: recep1@gmail.com
```
OR
```
Email:    receptionist@bmhealthcare.com
Password: receptionist123
```

---

## ✨ Features

### Visual Role Selection
- **Color-coded buttons** for easy identification
- **Icons** for each role type
- **Active state** shows which role is selected
- **Responsive design** works on all devices

### Smart Redirection
After successful login, you're automatically redirected to:
- **Patients** → `/dashboard` (Patient Dashboard)
- **Admin** → `/admin/dashboard` (Admin Dashboard)
- **Receptionist** → `/admin/dashboard` (Receptionist Dashboard)

### Single Sign-On
- One login page for all users
- No confusion about which page to use
- Simplified navigation
- Consistent user experience

---

## 🚀 Quick Start

1. **Open your browser**
   ```
   http://localhost:3000
   ```

2. **Click "Login" in the navigation bar**

3. **Select your role** (Patient, Admin, or Receptionist)

4. **Enter your credentials**

5. **Click "Login"**

6. **You're in!** 🎉

---

## 📱 Mobile Experience

The unified login page is fully responsive:
- Role selection buttons stack vertically on mobile
- Touch-friendly interface
- Same functionality as desktop
- Optimized for all screen sizes

---

## 🔒 Security

- Passwords are encrypted
- JWT token-based authentication
- Secure cookie storage
- Role-based access control
- Session management
- Auto-logout on token expiry

---

## ❓ Troubleshooting

### "Login failed" error
- Check if you entered the correct email and password
- Ensure you selected the correct role
- Verify the backend server is running

### Wrong dashboard after login
- The system redirects based on your **account role**, not the role you select
- The role selector is just for visual reference
- Your account role is determined when the account was created

### Can't access admin/receptionist features
- Make sure you're using an admin or receptionist account
- Patient accounts cannot access admin features
- Check your account role in the database

---

## 🎨 Customization

The role selection buttons can be customized in:
```
/frontend/src/pages/login.js
```

Look for the `roleOptions` array to modify:
- Colors
- Icons
- Descriptions
- Order

---

## 📝 Notes

- **Old login pages** (`/admin/login`, `/receptionist/login`) still exist but redirect to the main login page
- **Role selection** is visual only - actual access is determined by your account role
- **All users** use the same login page for consistency
- **Navigation** has been simplified to show a single "Login" link

---

## 🔗 Related Pages

- Main Login: http://localhost:3000/login
- Registration: http://localhost:3000/register
- Home Page: http://localhost:3000

---

**Last Updated:** November 8, 2025
**Status:** ✅ Fully functional and tested
