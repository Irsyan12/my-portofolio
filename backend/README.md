# Portfolio Backend API

Backend API untuk website portfolio dengan fitur lengkap termasuk manajemen project, experience, contact form, feedback, dan analytics.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth dengan role-based access
- **User Management** - Registration, login, profile management
- **Project Management** - CRUD operations dengan filtering dan pagination
- **Experience Management** - Work experience timeline
- **Contact System** - Contact form dengan admin dashboard
- **Feedback System** - Public feedback dengan approval system
- **Analytics** - Website visit tracking dan reporting
- **Rate Limiting** - Protection against spam dan abuse
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Standardized error responses

## 📋 Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account atau local MongoDB
- npm atau yarn

## 🛠️ Installation

1. **Clone dan setup:**

   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` dengan konfigurasi Anda:

   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
   JWT_SECRET=your-super-secret-jwt-key-should-be-at-least-32-characters-long
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **Create admin user:**

   ```bash
   npm run create-admin
   ```

4. **Seed sample data (optional):**

   ```bash
   npm run seed
   ```

5. **Start server:**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

Dokumentasi lengkap API tersedia di [API_Documentation.md](./API_Documentation.md)

### Base URL

- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

### Quick Start

1. **Login sebagai admin:**

   ```bash
   POST /api/users/login
   {
     "email": "admin@portfolio.com",
     "password": "admin123"
   }
   ```

2. **Get projects:**

   ```bash
   GET /api/projects?featured=true
   ```

3. **Send contact message:**
   ```bash
   POST /api/messages
   {
     "name": "John Doe",
     "email": "john@example.com",
     "subject": "Project Inquiry",
     "message": "Hello, I'm interested in your services..."
   }
   ```

## 🏗️ Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── userController.js
│   ├── projectController.js
│   ├── experienceController.js
│   ├── messageController.js
│   ├── feedbackController.js
│   └── visitController.js
├── middleware/           # Express middleware
│   └── auth.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Project.js
│   ├── Experience.js
│   ├── Message.js
│   ├── Feedback.js
│   └── Visit.js
├── routes/              # API routes
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── experienceRoutes.js
│   ├── messageRoutes.js
│   ├── feedbackRoutes.js
│   └── visitRoutes.js
├── scripts/             # Utility scripts
│   ├── createAdmin.js
│   └── seedData.js
├── .env.example         # Environment template
├── server.js           # Main server file
└── package.json
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Tokens) untuk authentication.

### Admin Credentials (default)

- **Email:** `admin@portfolio.com`
- **Password:** `admin123`

⚠️ **Penting:** Ubah password default setelah login pertama!

### Headers untuk Protected Endpoints

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User

- Authentication dan authorization
- Role-based access (admin/user)

### Project

- Portfolio projects dengan images
- Categories, technologies, links
- Featured projects support

### Experience

- Work experience timeline
- Technologies, achievements
- Current role tracking

### Message

- Contact form submissions
- Status tracking, admin notes
- Urgency levels

### Feedback

- Public feedback system
- Rating system (1-5 stars)
- Approval workflow

### Visit

- Analytics dan tracking
- Device, browser, OS detection
- Page views, duration

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start with nodemon

# Production
npm start               # Start server

# Database
npm run create-admin    # Create admin user
npm run seed           # Seed sample data

# Other
npm test               # Run tests (if configured)
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs untuk password encryption
- **Rate Limiting** - Protection against spam
- **CORS Configuration** - Cross-origin request handling
- **Helmet** - Security headers
- **Input Validation** - Data validation dengan Joi
- **Environment Variables** - Sensitive data protection

## 🚦 Rate Limits

- **Registration/Login:** 5-10 requests per 15 minutes
- **Contact Messages:** 5 messages per 10 minutes
- **Feedback:** 3 submissions per 30 minutes
- **General API:** 100 requests per 15 minutes
- **Visit Tracking:** 60 visits per minute

## 📈 Monitoring & Analytics

### Health Check

```bash
GET /api/status
```

Response:

```json
{
  "success": true,
  "status": "operational",
  "database": "connected",
  "uptime": 3600,
  "memory": {...},
  "timestamp": "2024-10-28T10:00:00.000Z"
}
```

### Visit Analytics

Track page views, user behavior, dan website statistics:

- Real-time visitor tracking
- Geographic data (basic)
- Device/browser detection
- Page view duration
- Referrer tracking

## 🐛 Error Handling

Semua API responses menggunakan format konsisten:

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🧪 Testing dengan Postman

1. Import collection dari dokumentasi API
2. Setup environment variables:

   - `base_url`: `http://localhost:5000`
   - `api_url`: `{{base_url}}/api`
   - `admin_token`: (akan di-set otomatis setelah login)

3. Test flow:
   - Login admin → Get token
   - Create/read projects
   - Send contact message
   - Submit feedback
   - View analytics

## 🔄 Database Migration

Jika ada perubahan schema:

1. Backup database terlebih dahulu
2. Update model files
3. Test dengan sample data
4. Deploy dengan hati-hati

## 🚀 Deployment

### Environment Variables (Production)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=super-secure-production-key
PORT=5000
NODE_ENV=production
CLIENT_URL=https://irsyanrmd.dev
```

### Deployment Checklist

- [ ] Update environment variables
- [ ] Create admin user
- [ ] Test all endpoints
- [ ] Setup monitoring
- [ ] Configure CORS untuk production domain
- [ ] Setup SSL certificate
- [ ] Configure rate limiting
- [ ] Test backup/restore procedures

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

Untuk pertanyaan atau dukungan:

- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/Irsyan12/my-portfolio/issues)

---

**Happy Coding! 🎉**
