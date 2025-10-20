# Backend API Documentation

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Đảm bảo file `.env` có đầy đủ config:
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=project-learning-9fdad
```

### 3. Run Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### **Public Endpoints (No Authentication Required)**

#### 1. Health Check
```http
GET /
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Advanced React Backend API",
  "version": "1.0.0"
}
```

---

#### 2. Register User
```http
POST /api/auth/register
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "uid": "firebase-user-id",
      "email": "user@example.com",
      "displayName": "John Doe",
      "token": "custom-firebase-token"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

#### 3. Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "token": "firebase-id-token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "uid": "firebase-user-id",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": false,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

### **Protected Endpoints (Authentication Required)**

**⚠️ Tất cả protected endpoints yêu cầu header:**
```http
Authorization: Bearer <firebase-id-token>
```

---

#### 4. Get User Profile
```http
GET /api/auth/me
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase-user-id",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": false,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid token"
}
```

---

#### 5. Update User Profile
```http
PUT /api/auth/me
```

**Request Body:**
```json
{
  "displayName": "John Smith",
  "photoURL": "https://example.com/photo.jpg",
  "phoneNumber": "+84123456789",
  "bio": "Software Developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "uid": "firebase-user-id",
      "email": "user@example.com",
      "displayName": "John Smith",
      "photoURL": "https://example.com/photo.jpg",
      "phoneNumber": "+84123456789",
      "bio": "Software Developer",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## 🔐 Authentication Flow

### Workflow:

1. **Register/Login trên Client-side:**
   ```javascript
   // Register
   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   
   // Get ID Token
   const idToken = await userCredential.user.getIdToken();
   
   // Send to backend
   await axios.post('/api/auth/register', { email, password, displayName });
   ```

2. **Login và lưu token:**
   ```javascript
   // Get ID Token after login
   const idToken = await user.getIdToken();
   
   // Verify với backend
   await axios.post('/api/auth/login', { token: idToken });
   ```

3. **Call protected endpoints:**
   ```javascript
   const idToken = await auth.currentUser.getIdToken();
   
   await axios.get('/api/auth/me', {
     headers: {
       'Authorization': `Bearer ${idToken}`
     }
   });
   ```

---

## 📦 Database Schema

### Firestore Collection: `users`

```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,            // User email
  displayName: string,      // User display name
  role: string,             // User role (default: "user")
  createdAt: timestamp,     // Created timestamp
  lastLoginAt: timestamp,   // Last login timestamp
  updatedAt: timestamp,     // Last update timestamp (optional)
  photoURL: string,         // Profile photo URL (optional)
  phoneNumber: string,      // Phone number (optional)
  bio: string,              // User bio (optional)
  // ... custom fields
}
```

---

## 🐛 Common Errors

### Error: "Could not load the default credentials"

**Solution:** Đảm bảo đã setup Firebase Admin SDK đúng cách. Nếu chạy local, cần set:
```bash
# Windows PowerShell
$env:GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"

# Linux/Mac
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
```

### Error: "Token is required"

**Solution:** Đảm bảo gửi token trong request body khi login hoặc trong Authorization header.

### Error: "Unauthorized - Invalid token"

**Solution:** Token có thể đã hết hạn. Refresh token từ Firebase Auth.

---

## 🎯 Best Practices

1. **Token Refresh**: ID tokens expire sau 1 giờ, nên refresh trước khi call API
2. **Error Handling**: Luôn handle errors từ API responses
3. **Security**: Không expose Firebase credentials trong client code
4. **Validation**: Backend đã validate input, nhưng nên validate ở client trước

---

## 📝 Notes

- API sử dụng **Firebase Admin SDK** để quản lý authentication
- Firestore được dùng để lưu thêm thông tin user
- Token verification được thực hiện bởi middleware `authenticateUser`
- Default role cho user mới là `"user"`