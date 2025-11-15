# 🧪 API Testing Guide - BM Healthcare

Complete guide to test all API endpoints using Postman, cURL, or any HTTP client.

## Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "9876543210",
  "gender": "male",
  "dateOfBirth": "1995-05-15"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

**POST** `/auth/login`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Current User

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update Profile

**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543211"
}
```

### 5. Change Password

**PUT** `/auth/change-password`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

---

## 👥 User Management (Admin Only)

### 1. Get All Users

**GET** `/users?page=1&limit=10&role=user`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 2. Get User by ID

**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 3. Create User

**POST** `/users`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "name": "New Receptionist",
  "email": "receptionist2@bmhealthcare.com",
  "password": "password123",
  "phone": "9876543213",
  "role": "receptionist"
}
```

### 4. Update User

**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "name": "Updated Name",
  "isActive": true
}
```

### 5. Delete User (Deactivate)

**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 6. Get User Statistics

**GET** `/users/stats`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## 👨‍⚕️ Doctor Management

### 1. Get All Doctors

**GET** `/doctors?page=1&limit=10&specialization=Cardiologist`

**Public endpoint - No auth required**

### 2. Get Doctor by ID

**GET** `/doctors/:id`

**Public endpoint**

### 3. Create Doctor (Admin)

**POST** `/doctors`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "name": "Dr. New Doctor",
  "email": "newdoctor@bmhealthcare.com",
  "phone": "9876543225",
  "specialization": "Orthopedic",
  "qualifications": "MBBS, MS (Orthopedics)",
  "experience": 10,
  "consultationFee": 700,
  "bio": "Specialist in bone and joint treatments",
  "availableSlots": [
    {
      "day": "Monday",
      "startTime": "10:00",
      "endTime": "14:00",
      "slotDuration": 30,
      "maxAppointments": 1
    }
  ]
}
```

### 4. Update Doctor (Admin)

**PUT** `/doctors/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "consultationFee": 800,
  "isActive": true
}
```

### 5. Delete Doctor (Admin)

**DELETE** `/doctors/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 6. Get Doctor Slots

**GET** `/doctors/:id/slots`

**Public endpoint**

### 7. Get All Specializations

**GET** `/doctors/specializations/list`

**Public endpoint**

---

## 📅 Appointment Management

### 1. Create Appointment

**POST** `/appointments`

**Headers:**
```
Authorization: Bearer USER_TOKEN
```

**Body:**
```json
{
  "doctor": "DOCTOR_ID_HERE",
  "appointmentDate": "2025-11-10",
  "appointmentTime": "10:00",
  "symptoms": "Chest pain and breathing difficulty",
  "notes": "Patient has history of hypertension"
}
```

### 2. Get All Appointments

**GET** `/appointments?status=pending&page=1&limit=10`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `status`: pending, confirmed, completed, cancelled
- `doctor`: Doctor ID
- `patient`: Patient ID
- `date`: YYYY-MM-DD
- `page`: Page number
- `limit`: Items per page

### 3. Get Appointment by ID

**GET** `/appointments/:id`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 4. Confirm Appointment (Receptionist/Admin)

**PUT** `/appointments/:id/confirm`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
```

### 5. Cancel Appointment

**PUT** `/appointments/:id/cancel`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "cancellationReason": "Patient not available"
}
```

### 6. Update Appointment (Receptionist/Admin)

**PUT** `/appointments/:id`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
```

**Body:**
```json
{
  "status": "completed",
  "prescriptionNotes": "Prescribed medication for 7 days"
}
```

### 7. Get Appointment Statistics

**GET** `/appointments/stats/dashboard`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## 🧪 Test Management

### 1. Get All Tests

**GET** `/tests?category=Blood+Test&page=1&limit=20`

**Public endpoint**

### 2. Get Test by ID

**GET** `/tests/:id`

**Public endpoint**

### 3. Create Test (Admin)

**POST** `/tests`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "name": "Complete Blood Count (CBC)",
  "description": "Comprehensive blood test",
  "category": "Blood Test",
  "price": 300,
  "preparationInstructions": "No special preparation required",
  "reportDeliveryTime": "6 hours",
  "isHomeCollectionAvailable": true,
  "homeCollectionCharge": 50,
  "parameters": ["Hemoglobin", "RBC", "WBC", "Platelets"]
}
```

### 4. Update Test (Admin)

**PUT** `/tests/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "price": 350,
  "isActive": true
}
```

### 5. Delete Test (Admin)

**DELETE** `/tests/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 6. Get Test Categories

**GET** `/tests/categories/list`

**Public endpoint**

---

## 🧪 Test Booking Management

### 1. Create Test Booking

**POST** `/tests/bookings`

**Headers:**
```
Authorization: Bearer USER_TOKEN
```

**Body:**
```json
{
  "tests": [
    { "testId": "TEST_ID_1" },
    { "testId": "TEST_ID_2" }
  ],
  "bookingDate": "2025-11-10",
  "bookingTime": "09:00",
  "collectionType": "home",
  "collectionAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "notes": "Please call before arriving"
}
```

### 2. Get All Test Bookings

**GET** `/tests/bookings?status=pending&page=1&limit=10`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 3. Get Test Booking by ID

**GET** `/tests/bookings/:id`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 4. Confirm Test Booking (Receptionist/Admin)

**PUT** `/tests/bookings/:id/confirm`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
```

### 5. Update Test Booking (Receptionist/Admin)

**PUT** `/tests/bookings/:id`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
```

**Body:**
```json
{
  "status": "sample_collected",
  "notes": "Sample collected successfully"
}
```

---

## 📄 Report Management

### 1. Upload Report (Receptionist/Admin)

**POST** `/reports`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- `report`: [File] PDF or Image file
- `testBooking`: TEST_BOOKING_ID
- `remarks`: "Report uploaded successfully"

### 2. Get All Reports

**GET** `/reports?patient=PATIENT_ID&page=1&limit=10`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 3. Get Report by ID

**GET** `/reports/:id`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 4. Update Report (Receptionist/Admin)

**PUT** `/reports/:id`

**Headers:**
```
Authorization: Bearer RECEPTIONIST_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- `report`: [File] New PDF or Image file (optional)
- `remarks`: "Updated remarks"

### 5. Delete Report (Admin)

**DELETE** `/reports/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

### 6. Download Report

**GET** `/reports/:id/download`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "filename": "report.pdf"
}
```

---

## 💳 Payment Management

### 1. Create Razorpay Order

**POST** `/payments/create-order`

**Headers:**
```
Authorization: Bearer USER_TOKEN
```

**Body:**
```json
{
  "bookingType": "appointment",
  "bookingId": "APPOINTMENT_ID",
  "amount": 800
}
```

**Response:**
```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 80000,
  "currency": "INR",
  "paymentId": "PAYMENT_RECORD_ID",
  "key": "rzp_test_xxxxx"
}
```

### 2. Verify Payment

**POST** `/payments/verify`

**Headers:**
```
Authorization: Bearer USER_TOKEN
```

**Body:**
```json
{
  "razorpayOrderId": "order_xxxxxxxxxxxxx",
  "razorpayPaymentId": "pay_xxxxxxxxxxxxx",
  "razorpaySignature": "signature_string",
  "paymentId": "PAYMENT_RECORD_ID"
}
```

### 3. Get All Payments

**GET** `/payments?status=completed&page=1&limit=10`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 4. Get Payment by ID

**GET** `/payments/:id`

**Headers:**
```
Authorization: Bearer TOKEN
```

### 5. Refund Payment (Admin)

**POST** `/payments/:id/refund`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "refundAmount": 800,
  "refundReason": "Appointment cancelled by doctor"
}
```

### 6. Get Payment Statistics

**GET** `/payments/stats/dashboard`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## 🧪 Testing Workflow

### Complete User Journey

1. **Register User**
   ```
   POST /auth/register
   ```

2. **Login**
   ```
   POST /auth/login
   Save the token for subsequent requests
   ```

3. **Browse Doctors**
   ```
   GET /doctors
   GET /doctors/:id
   ```

4. **Book Appointment**
   ```
   POST /appointments
   ```

5. **Create Payment Order**
   ```
   POST /payments/create-order
   ```

6. **Verify Payment**
   ```
   POST /payments/verify
   ```

7. **Check Appointment Status**
   ```
   GET /appointments/:id
   ```

### Admin Workflow

1. **Login as Admin**
   ```
   POST /auth/login
   Email: admin@bmhealthcare.com
   Password: admin123
   ```

2. **Add New Doctor**
   ```
   POST /doctors
   ```

3. **Add New Test**
   ```
   POST /tests
   ```

4. **View Statistics**
   ```
   GET /appointments/stats/dashboard
   GET /payments/stats/dashboard
   ```

### Receptionist Workflow

1. **Login as Receptionist**
   ```
   POST /auth/login
   Email: receptionist@bmhealthcare.com
   Password: receptionist123
   ```

2. **View Pending Appointments**
   ```
   GET /appointments?status=pending
   ```

3. **Confirm Appointment**
   ```
   PUT /appointments/:id/confirm
   ```

4. **Upload Report**
   ```
   POST /reports
   ```

---

## 🔧 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "BM Healthcare API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 📝 Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🐛 Debugging Tips

1. **Check token expiry**: Tokens expire after 30 days
2. **Verify role permissions**: Some endpoints require admin/receptionist role
3. **Check request body**: Ensure all required fields are present
4. **Validate IDs**: Use valid MongoDB ObjectIDs
5. **Check environment**: Ensure backend is running on port 5000

---

**Happy Testing! 🚀**
