# Portfolio Backend API Documentation

## Daftar Isi

1. [Setup & Installation](#setup--installation)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Projects](#projects)
5. [Experiences](#experiences)
6. [Messages (Contact Form)](#messages-contact-form)
7. [Feedback](#feedback)
8. [Analytics (Visits)](#analytics-visits)
9. [Postman Collection Setup](#postman-collection-setup)

---

## Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` dan isi dengan konfigurasi Anda:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=your-super-secret-jwt-key-should-be-at-least-32-characters-long
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Create Admin User

```bash
npm run create-admin
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

---

## Authentication

### Headers

Untuk endpoint yang memerlukan authentication, tambahkan header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Admin

**POST** `/api/users/login`

**Body:**

```json
{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Portfolio Admin",
      "email": "admin@portfolio.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

---

## User Management

### 1. Register User (Public)

**POST** `/api/users/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 2. Login (Public)

**POST** `/api/users/login`

**Body:**

```json
{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

### 3. Get Profile (Auth Required)

**GET** `/api/users/profile`

**Headers:**

```
Authorization: Bearer <token>
```

### 4. Get All Users (Admin Only)

**GET** `/api/users`

**Headers:**

```
Authorization: Bearer <admin_token>
```

### 5. Get User by ID (Admin Only)

**GET** `/api/users/:id`

### 6. Update User (Admin Only)

**PUT** `/api/users/:id`

**Body:**

```json
{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 7. Delete User (Admin Only)

**DELETE** `/api/users/:id`

---

## Projects

### 1. Get All Projects (Public)

**GET** `/api/projects`

**Query Parameters:**

- `category` - Filter by category (web, mobile, desktop, ai/ml, other)
- `featured` - Filter featured projects (true/false)
- `status` - Filter by status (completed, in-progress, planned)
- `search` - Search in title and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc, default: desc)

**Example:**

```
GET /api/projects?category=web&featured=true&page=1&limit=5
```

### 2. Get Featured Projects (Public)

**GET** `/api/projects/featured`

### 3. Get Project by ID (Public)

**GET** `/api/projects/:id`

### 4. Get All Projects for Admin (Admin Only)

**GET** `/api/projects/admin/all`

### 5. Get Project Statistics (Admin Only)

**GET** `/api/projects/admin/stats`

### 6. Create Project (Admin Only)

**POST** `/api/projects`

**Body:**

```json
{
  "title": "Portfolio Website",
  "description": "A modern portfolio website built with React and Node.js",
  "shortDescription": "Modern portfolio website with React",
  "technologies": ["React", "Node.js", "MongoDB", "Express"],
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "Homepage screenshot"
    }
  ],
  "thumbnailImage": "https://example.com/thumbnail.jpg",
  "demoUrl": "https://portfolio-demo.com",
  "githubUrl": "https://github.com/user/portfolio",
  "category": "web",
  "status": "completed",
  "featured": true,
  "startDate": "2024-01-01",
  "endDate": "2024-02-01",
  "isPublic": true,
  "order": 1
}
```

### 7. Update Project (Admin Only)

**PUT** `/api/projects/:id`

### 8. Toggle Featured Status (Admin Only)

**PATCH** `/api/projects/:id/featured`

### 9. Delete Project (Admin Only)

**DELETE** `/api/projects/:id`

---

## Experiences

### 1. Get All Experiences (Public)

**GET** `/api/experiences`

**Query Parameters:**

- `employmentType` - Filter by type (full-time, part-time, contract, internship, freelance)
- `company` - Filter by company name
- `sortBy` - Sort field (default: startDate)
- `sortOrder` - Sort order (asc/desc, default: desc)

### 2. Get Current Experience (Public)

**GET** `/api/experiences/current`

### 3. Get Experience Timeline (Public)

**GET** `/api/experiences/timeline`

### 4. Get Experience by ID (Public)

**GET** `/api/experiences/:id`

### 5. Get Experience Statistics (Admin Only)

**GET** `/api/experiences/admin/stats`

### 6. Create Experience (Admin Only)

**POST** `/api/experiences`

**Body:**

```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Company Ltd",
  "location": "Jakarta, Indonesia",
  "description": "Leading development of web applications using modern technologies",
  "responsibilities": [
    "Develop and maintain web applications",
    "Lead a team of junior developers",
    "Code review and mentoring"
  ],
  "technologies": ["React", "Node.js", "PostgreSQL", "AWS"],
  "achievements": [
    "Improved application performance by 40%",
    "Led migration to microservices architecture"
  ],
  "employmentType": "full-time",
  "startDate": "2023-01-01",
  "endDate": null,
  "isCurrentRole": true,
  "companyLogo": "https://example.com/logo.png",
  "companyWebsite": "https://company.com",
  "order": 1
}
```

### 7. Update Experience (Admin Only)

**PUT** `/api/experiences/:id`

### 8. Delete Experience (Admin Only)

**DELETE** `/api/experiences/:id`

---

## Messages (Contact Form)

### 1. Send Message (Public)

**POST** `/api/messages`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hi, I'm interested in your web development services..."
}
```

### 2. Get All Messages (Admin Only)

**GET** `/api/messages`

**Query Parameters:**

- `status` - Filter by status (new, read, replied, archived)
- `isStarred` - Filter starred messages (true/false)
- `search` - Search in name, subject, message
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field
- `sortOrder` - Sort order

### 3. Get Message by ID (Admin Only)

**GET** `/api/messages/:id`

### 4. Update Message Status (Admin Only)

**PATCH** `/api/messages/:id/status`

**Body:**

```json
{
  "status": "replied",
  "adminNotes": "Replied via email",
  "tags": ["web-development", "urgent"]
}
```

### 5. Toggle Star (Admin Only)

**PATCH** `/api/messages/:id/star`

### 6. Get Message Statistics (Admin Only)

**GET** `/api/messages/stats`

### 7. Get Recent Messages (Admin Only)

**GET** `/api/messages/recent?limit=5`

### 8. Delete Message (Admin Only)

**DELETE** `/api/messages/:id`

---

## Feedback

### 1. Get Public Feedback (Public)

**GET** `/api/feedback`

**Query Parameters:**

- `rating` - Filter by rating (1-5)
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field
- `sortOrder` - Sort order

### 2. Get Top Rated Feedback (Public)

**GET** `/api/feedback/top-rated?limit=5`

### 3. Submit Feedback (Public)

**POST** `/api/feedback`

**Body:**

```json
{
  "rating": 5
}
```

### 4. Get All Feedback (Admin Only)

**GET** `/api/feedback/admin/all`

### 5. Get Feedback Statistics (Admin Only)

**GET** `/api/feedback/admin/stats`

### 6. Update Feedback (Admin Only)

**PUT** `/api/feedback/:id`

### 7. Delete Feedback (Admin Only)

**DELETE** `/api/feedback/:id`

---

## Analytics (Visits)

### 1. Track Visit (Public)

**POST** `/api/visits/track`

**Body:**

```json
{
  "page": "/",
  "referrer": "https://google.com",
  "sessionId": "unique-session-id",
  "duration": 45
}
```

### 2. Get Analytics (Admin Only)

**GET** `/api/visits/analytics`

**Query Parameters:**

- `period` - Time period (7d, 30d, 90d, 365d)
- `page` - Filter by specific page
- `startDate` - Custom start date (YYYY-MM-DD)
- `endDate` - Custom end date (YYYY-MM-DD)

**Example:**

```
GET /api/visits/analytics?period=30d&page=/projects
```

### 3. Get Real-time Statistics (Admin Only)

**GET** `/api/visits/realtime`

### 4. Get Visit Trends (Admin Only)

**GET** `/api/visits/trends?period=30d`

---

## Postman Collection Setup

### 1. Import Collection

Buat collection baru di Postman dengan struktur berikut:

```
Portfolio API
├── Auth
│   ├── Register User
│   ├── Login Admin
│   └── Get Profile
├── Users
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Update User
│   └── Delete User
├── Projects
│   ├── Get All Projects
│   ├── Get Featured Projects
│   ├── Get Project by ID
│   ├── Create Project
│   ├── Update Project
│   ├── Toggle Featured
│   └── Delete Project
├── Experiences
│   ├── Get All Experiences
│   ├── Get Current Experience
│   ├── Create Experience
│   ├── Update Experience
│   └── Delete Experience
├── Messages
│   ├── Send Message
│   ├── Get All Messages
│   ├── Get Message by ID
│   ├── Update Status
│   └── Toggle Star
├── Feedback
│   ├── Get Public Feedback
│   ├── Submit Feedback
│   ├── Get All Feedback (Admin)
│   ├── Approve Feedback
│   └── Toggle Public
└── Analytics
    ├── Track Visit
    ├── Get Analytics
    ├── Get Real-time Stats
    └── Get Trends
```

### 2. Environment Variables

Buat environment dengan variables:

```json
{
  "base_url": "http://localhost:5000",
  "api_url": "{{base_url}}/api",
  "admin_token": "",
  "user_token": ""
}
```

### 3. Pre-request Script untuk Authentication

Untuk request yang memerlukan authentication, tambahkan di Headers:

```
Authorization: Bearer {{admin_token}}
```

### 4. Test Scripts

Tambahkan test script untuk menyimpan token setelah login:

```javascript
// Untuk login endpoint
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.data && response.data.token) {
    pm.environment.set("admin_token", response.data.token);
  }
}
```

---

## Testing Examples

### 1. Complete Authentication Flow

1. **Login Admin:**

   ```
   POST {{api_url}}/users/login
   Body: {"email": "admin@portfolio.com", "password": "admin123"}
   ```

2. **Get Profile:**
   ```
   GET {{api_url}}/users/profile
   Headers: Authorization: Bearer {{admin_token}}
   ```

### 2. Create and Manage Project

1. **Create Project:**

   ```
   POST {{api_url}}/projects
   Headers: Authorization: Bearer {{admin_token}}
   Body: {project data}
   ```

2. **Get All Projects:**

   ```
   GET {{api_url}}/projects?featured=true&limit=5
   ```

3. **Toggle Featured:**
   ```
   PATCH {{api_url}}/projects/{project_id}/featured
   Headers: Authorization: Bearer {{admin_token}}
   ```

### 3. Contact Form Flow

1. **Send Message:**

   ```
   POST {{api_url}}/messages
   Body: {message data}
   ```

2. **Admin View Messages:**

   ```
   GET {{api_url}}/messages?status=new
   Headers: Authorization: Bearer {{admin_token}}
   ```

3. **Update Message Status:**
   ```
   PATCH {{api_url}}/messages/{message_id}/status
   Headers: Authorization: Bearer {{admin_token}}
   Body: {"status": "replied", "adminNotes": "Responded via email"}
   ```

---

## Error Handling

Semua response menggunakan format standar:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Rate Limiting

- **Registration/Login**: 5-10 requests per 15 minutes
- **Messages**: 5 messages per 10 minutes
- **Feedback**: 3 feedback per 30 minutes
- **General API**: 100 requests per 15 minutes
- **Visit Tracking**: 60 visits per minute

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Invalid Token
- `403` - Forbidden / Admin Required
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error
