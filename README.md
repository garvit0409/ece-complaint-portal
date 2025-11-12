# ECE Complaint Portal

A comprehensive three-tier hierarchical complaint management system for ECE Department with automated email notifications and role-based portals.

## 🌟 Features

### **Three-Level Complaint Hierarchy**
- **Student** → **Teacher** → **Mentor** → **HOD**
- Automated escalation system
- Real-time status tracking

### **Role-Based Portals**
- **Student Portal**: Submit complaints, track status, provide feedback
- **Teacher Portal**: Manage complaints, organize students, add teachers
- **Mentor Portal**: Handle escalations, monitor teachers, view analytics
- **HOD Portal**: Complete system administration, reports, management

### **Advanced Features**
- ✅ Anonymous complaint system with identity protection
- ✅ Automated email notifications at every status change
- ✅ File upload support (Cloudinary integration)
- ✅ Student promotion system (1st → 2nd → 3rd → 4th year)
- ✅ Lateral entry support for 2nd-year students
- ✅ Complaint reopening functionality
- ✅ Teacher management by teachers (as requested)
- ✅ Priority levels and categorization
- ✅ Feedback and rating system

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account (for email notifications)
- Cloudinary account (for file uploads)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ece-complaint-portal
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Configure your API URL
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5175
   - Backend: http://localhost:5000

## 📋 Environment Configuration

### **Backend (.env)**
```env
# Database
MONGODB_URI=mongodb+srv://...

# Email (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
```

## 🏗️ Project Structure

```
ece-complaint-portal/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components by role
│   │   │   ├── public/              # Landing, Login, Register
│   │   │   ├── student/             # Student portal
│   │   │   ├── teacher/             # Teacher portal
│   │   │   ├── mentor/              # Mentor portal
│   │   │   └── hod/                 # HOD portal
│   │   └── services/                # API services
├── server/                          # Node.js Backend
│   ├── config/                      # Database, email, cloudinary
│   ├── controllers/                 # Route controllers
│   ├── models/                      # MongoDB schemas
│   ├── routes/                      # API routes
│   ├── middleware/                  # Auth, upload middleware
│   └── utils/                       # Helper functions
└── docs/                            # Documentation
```

## 🔐 Authentication & Security

- **JWT-based authentication** with role-based access control
- **Password encryption** using bcrypt
- **Rate limiting** and security headers
- **Anonymous complaint protection** with encryption
- **Audit logging** for sensitive operations

## 📧 Email Notification System

Automated emails sent for:
- Complaint submission confirmation
- Status changes (Pending → In Review → Resolved)
- Escalation notifications
- Resolution updates
- Feedback requests

## ☁️ Deployment

### **Recommended Stack**
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free tier)
- **Database**: MongoDB Atlas (free tier)
- **File Storage**: Cloudinary (free tier)
- **Email**: Gmail SMTP

### **Deployment Guide**
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and email verification
- [ ] Login/logout functionality
- [ ] Complaint submission with file uploads
- [ ] Status tracking and notifications
- [ ] Role-based access control
- [ ] Anonymous complaint system
- [ ] Teacher management features
- [ ] Student promotion system
- [ ] Escalation workflow
- [ ] Feedback and rating system

## 📊 API Documentation

### **Authentication Routes**
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### **Complaint Routes**
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints (role-based)
- `PUT /api/complaints/:id/status` - Update status
- `PUT /api/complaints/:id/escalate` - Escalate complaint

### **User Management Routes**
- `GET /api/users/profile` - Get user profile
- `GET /api/teacher/students` - Get assigned students
- `POST /api/teacher/students/promote` - Promote students

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the deployment guide for common issues
- Review the project documentation

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI chatbot for complaint guidance
- [ ] SMS notifications (Twilio)
- [ ] Advanced analytics with ML insights
- [ ] Integration with college ERP system
- [ ] QR code complaint tracking
- [ ] Voice complaint submission

---

**Built with ❤️ for ECE Department complaint management**
