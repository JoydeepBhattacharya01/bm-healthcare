# Login Debugging Steps

## Changes Made

### 1. Fixed Missing Imports
- Added `toast` import to admin and receptionist login pages
- Added `logout` to useAuth destructuring

### 2. Fixed Login Flow
- Added `skipRedirect` parameter to AuthContext login function
- Admin and receptionist pages now handle their own redirects after role validation
- Main login page uses default redirect behavior

### 3. Added Debug Logging
- All login pages now log attempts and results to console

## How to Debug

### Step 1: Open Browser Console
1. Open the application in browser
2. Press F12 or Right-click → Inspect
3. Go to Console tab

### Step 2: Try Login
Try logging in with test credentials and watch the console for:
- "Attempting login with: [email]"
- "Login result: {success: true/false, user: {...}}"
- Any error messages

### Step 3: Check Network Tab
1. Go to Network tab in DevTools
2. Try login again
3. Look for the `/api/auth/login` request
4. Check:
   - Status code (should be 200)
   - Response data
   - Any CORS errors

## Test Credentials

### Patient (use /login page)
- Email: john@example.com
- Password: user123

### Admin (use /admin/login page)
- Email: admin1@gmail.com
- Password: admin123

OR

- Email: admin@bmhealthcare.com
- Password: admin123

### Receptionist (use /receptionist/login page)
- Email: recep1@gmail.com
- Password: recep1@gmail.com

## Common Issues

### Issue 1: CORS Error
**Symptom**: Console shows CORS policy error
**Solution**: Check that backend FRONTEND_URL matches your frontend URL

### Issue 2: Network Error
**Symptom**: Console shows "Network Error" or "Failed to fetch"
**Solution**: 
- Check backend is running on port 5001
- Check frontend .env.local has correct API_URL

### Issue 3: 401 Unauthorized
**Symptom**: Login returns 401 error
**Solution**: 
- Check credentials are correct
- Run `npm run seed` in backend to reset test users

### Issue 4: Redirect Loop
**Symptom**: Page keeps redirecting
**Solution**: Clear cookies and try again

### Issue 5: No Feedback
**Symptom**: Button just spins, no error or success
**Solution**: Check console for JavaScript errors

## Quick Test

Open this file in browser to test API directly:
`test-login.html`

## Backend API Test

Test backend directly with curl:

```bash
# Test user login
curl -X POST http://192.168.1.5:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"user123"}'

# Test admin login
curl -X POST http://192.168.1.5:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@gmail.com","password":"admin123"}'

# Test receptionist login
curl -X POST http://192.168.1.5:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recep1@gmail.com","password":"recep1@gmail.com"}'
```

All should return 200 OK with user data and token.
