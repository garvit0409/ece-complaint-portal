# ECE Complaint Portal - Comprehensive Project Plan

## 🎯 Project Overview
A three-tier hierarchical complaint management system for ECE Department with automated email notifications and role-based portals for Students, Teachers, Mentors, and HOD.

---

## 📋 Core System Architecture

### Three-Level Complaint Hierarchy
```
Student → Teacher → Mentor → HOD
```

**Escalation Flow:**
1. Student submits complaint to **Teacher**
2. If unresolved/escalated → Goes to **Mentor**
3. If still unresolved/escalated → Goes to **HOD**
4. Each level can resolve or escalate to next level

---

## 👥 User Roles & Permissions

### 1. **Student Portal**
- Register/Login (with email verification)
- Submit complaints to Teacher/Mentor/HOD
- **🔒 Anonymous Complaint Option** (identity hidden from all handlers)
- Track complaint status in real-time
- Receive automated email notifications
- View complaint history
- Reopen resolved complaints (with justification)
- Rate and provide feedback after resolution
- Select specific teacher from dropdown
- Priority level selection (Low/Medium/High)

### 2. **Teacher Portal**
- Login with credentials
- View complaints assigned to them
- Change complaint status (Pending → In Review → Resolved/Escalate to Mentor)
- Add resolution notes
- View student list (year-wise: 1st, 2nd, 3rd, 4th year)
- Organize students by year
- Promote students (1st year → 2nd year, etc.)
- **Manage other teachers** (Add/Edit/View teacher profiles)
- **Assign students to teachers**
- Dashboard with complaint statistics
- Email notifications for new complaints
=======

### 3. **Mentor Portal**
- Login with credentials
- View escalated complaints from Teachers
- Resolve or escalate to HOD
- Monitor teacher performance
- View all complaints under their mentorship
- Add resolution notes
- Dashboard with analytics
- Email notifications

### 4. **HOD Portal**
- Super admin access
- View all complaints (Teacher, Mentor, HOD level)
- Final resolution authority
- Add/Edit/Remove Teachers
- Add/Edit/Remove Mentors
- Manage student records
- Register lateral entry students (2nd year)
- Generate reports (Excel/PDF)
- View comprehensive analytics dashboard
- System-wide settings management
- Email notifications

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Secure token-based authentication
- Role-based access control (RBAC)
- Password encryption using bcrypt
- Email verification on registration
- Forgot password with email reset link
- Session management

### User Types
```javascript
{
  STUDENT: 'student',
  TEACHER: 'teacher',
  MENTOR: 'mentor',
  HOD: 'hod'
}
```

---

## 📝 Database Schema Design

### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'teacher', 'mentor', 'hod'],
  rollNumber: String (for students),
  employeeId: String (for teachers/mentors/hod),
  year: Number (1-4, for students),
  department: String (default: 'ECE'),
  isLateralEntry: Boolean (for 2nd year lateral students),
  assignedTeacher: ObjectId (ref: Users - for students),
  assignedMentor: ObjectId (ref: Users - for teachers),
  isEmailVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Complaints Collection**
```javascript
{
  _id: ObjectId,
  complaintId: String (auto-generated: ECE-COMP-XXXX),
  studentId: ObjectId (ref: Users),
  studentName: String,
  isAnonymous: Boolean,
  actualStudentId: ObjectId (ref: Users - only accessible by HOD),
  
  // Complaint Details
  category: Enum [
    'Lab Equipment',
    'Classroom Infrastructure',
    'Faculty Related',
    'Academic Issues',
    'Project/Internship',
    'Exam Related',
    'Attendance Issues',
    'Timetable Issues',
    'Others'
  ],
  title: String,
  description: String,
  attachments: [String] (file URLs),
  priority: Enum ['Low', 'Medium', 'High'],
  
  // Hierarchical Assignment
  currentLevel: Enum ['teacher', 'mentor', 'hod'],
  assignedTo: ObjectId (ref: Users),
  assignedTeacher: ObjectId (ref: Users),
  assignedMentor: ObjectId (ref: Users),
  
  // Status Tracking
  status: Enum ['Pending', 'In Review', 'Resolved', 'Escalated', 'Rejected', 'Reopened'],
  
  // Resolution Details
  resolutionNotes: [{
    resolvedBy: ObjectId (ref: Users),
    role: String,
    note: String,
    action: String,
    timestamp: Date
  }],
  
  // Escalation History
  escalationHistory: [{
    from: String (role),
    to: String (role),
    reason: String,
    timestamp: Date
  }],
  
  // Reopening
  isReopened: Boolean,
  reopenReason: String,
  reopenedAt: Date,
  
  // Feedback
  feedback: {
    rating: Number (1-5),
    comment: String,
    submittedAt: Date
  },
  
  // Timestamps
  submittedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Notifications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  complaintId: ObjectId (ref: Complaints),
  type: Enum ['complaint_submitted', 'status_changed', 'escalated', 'resolved', 'reopened'],
  message: String,
  isRead: Boolean,
  emailSent: Boolean,
  createdAt: Date
}
```

### 4. **EmailLogs Collection**
```javascript
{
  _id: ObjectId,
  to: String,
  subject: String,
  body: String,
  complaintId: String,
  status: Enum ['sent', 'failed'],
  sentAt: Date
}
```

### 5. **StudentPromotion Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Users),
  fromYear: Number,
  toYear: Number,
  promotedBy: ObjectId (ref: Users),
  academicYear: String,
  promotedAt: Date
}
```

---

## 🚀 Core Features Implementation

### 1. **User Registration & Authentication**
- Student registration with roll number, email, password
- Email verification link sent via Nodemailer
- Teacher/Mentor/HOD accounts created by HOD
- JWT token generation on login
- Forgot password with email reset link
- Role-based dashboard redirection

### 2. **Complaint Submission System**
- Multi-step form with validation
- Category selection dropdown
- Teacher selection dropdown (populated from database)
- File upload support (Multer/Cloudinary) - up to 5 files
- **🔒 Anonymous Complaint Checkbox** (hides student identity)
  - When anonymous: Student name shown as "Anonymous Student"
  - Roll number hidden
  - Email notifications sent to student's email but identity protected
  - Only HOD can view actual student identity (for accountability)
- Priority level selection (Low/Medium/High)
- Auto-generated Complaint ID (ECE-COMP-XXXX)
- Immediate email notification to assigned teacher

### 3. **Three-Level Complaint Management**

#### **Level 1: Teacher**
- Receives complaint notification via email
- Can view complaint details
- Actions:
  - Mark as "In Review"
  - Add resolution notes
  - Mark as "Resolved"
  - Escalate to Mentor (with reason)
- Student receives email on every status change

#### **Level 2: Mentor**
- Receives escalated complaints
- Can view all complaints under their teachers
- Actions:
  - Review and add notes
  - Mark as "Resolved"
  - Escalate to HOD (with reason)
- Email notifications sent to student and teacher

#### **Level 3: HOD**
- Final authority on all complaints
- Can view all complaints in system
- Actions:
  - Review and resolve
  - Mark as "Rejected" (with reason)
  - Final resolution
- Email notifications to all parties

### 4. **Automated Email Notification System**

**Email Triggers:**
- Complaint submitted → Email to Student (confirmation) + Assigned Teacher
- Status changed to "In Review" → Email to Student
- Complaint escalated → Email to Student + Next level handler
- Complaint resolved → Email to Student with resolution details
- Complaint reopened → Email to previous resolver + Current handler
- Complaint rejected → Email to Student with reason

**Email Template Structure:**
```
Subject: [ECE Portal] Complaint #ECE-COMP-XXXX - [Status]

Dear [Name],

Your complaint regarding "[Title]" has been [Action].

Complaint ID: ECE-COMP-XXXX
Current Status: [Status]
Assigned To: [Handler Name] ([Role])

[Additional Details]

You can track your complaint at: [Portal Link]

Best regards,
ECE Complaint Management System
```

### 5. **Student Management System**

#### **For Teachers:**
- View students by year (1st, 2nd, 3rd, 4th)
- Filter and search students
- Promote students to next year
- View student complaint history

#### **For HOD:**
- Add new students (regular admission)
- Register lateral entry students (2nd year)
- Bulk student upload (CSV/Excel)
- Edit student details
- Assign students to teachers
- Assign teachers to mentors
- View complete student database

### 6. **Teacher Management System (Teachers & HOD)**

#### **For Teachers:**
- View all teachers in department
- Add new teacher profiles
- Edit teacher information (name, email, contact, specialization)
- Assign students to teachers
- View teacher workload (number of students assigned)
- Cannot delete or deactivate teachers (HOD only)

#### **For HOD:**
- All teacher management permissions
- Add new teacher with credentials
- Edit teacher information
- Assign mentor to teacher
- Deactivate/Activate teacher accounts
- Delete teacher accounts
- View teacher performance metrics
- Reassign students if teacher changes
- Assign teachers to mentors

### 7. **Complaint Reopening System**
- Students can reopen resolved complaints
- Must provide justification for reopening
- Reopened complaint goes back to last resolver
- Email notification sent to all previous handlers
- Reopening history tracked

### 8. **Status Tracking & Search**
- Search by Complaint ID
- "My Complaints" page with filters
- Filter by status, category, date range
- Real-time status updates
- Timeline view of complaint progress

### 9. **Feedback & Rating System**
- Post-resolution feedback form
- 5-star rating system
- Comment section
- Feedback visible to resolvers
- Analytics on resolution satisfaction

### 10. **Dashboard & Analytics**

#### **Student Dashboard:**
- Total complaints submitted
- Pending/Resolved count
- Recent complaints
- Quick submit button

#### **Teacher Dashboard:**
- Complaints assigned to me
- Pending actions count
- Resolved complaints
- Student list by year
- Performance metrics

#### **Mentor Dashboard:**
- Escalated complaints
- Teacher performance overview
- Resolution time analytics
- Complaint trends

#### **HOD Dashboard:**
- System-wide statistics
- Total complaints (all levels)
- Category-wise distribution (Chart.js)
- Resolution time analytics
- Teacher/Mentor performance
- Monthly/Yearly trends
- Export reports (Excel/PDF)

---

## 🎨 Frontend Pages Structure

### **Public Pages**
1. **Landing Page** (`/`)
   - Portal introduction
   - Features overview
   - Login/Register buttons

2. **Login Page** (`/login`)
   - Email & password
   - Role selection
   - Forgot password link

3. **Register Page** (`/register`)
   - Student registration form
   - Email verification

4. **Forgot Password** (`/forgot-password`)
   - Email input
   - Reset link sent

### **Student Portal** (`/student/*`)
1. **Dashboard** (`/student/dashboard`)
2. **Submit Complaint** (`/student/submit-complaint`)
3. **My Complaints** (`/student/my-complaints`)
4. **Track Complaint** (`/student/track/:complaintId`)
5. **Profile** (`/student/profile`)
6. **Feedback** (`/student/feedback/:complaintId`)

### **Teacher Portal** (`/teacher/*`)
1. **Dashboard** (`/teacher/dashboard`)
2. **Complaints** (`/teacher/complaints`)
3. **Complaint Details** (`/teacher/complaint/:id`)
4. **Students** (`/teacher/students`)
5. **Promote Students** (`/teacher/promote-students`)
6. **Manage Teachers** (`/teacher/manage-teachers`)
7. **Add Teacher** (`/teacher/add-teacher`)
8. **Assign Students** (`/teacher/assign-students`)
9. **Profile** (`/teacher/profile`)

### **Mentor Portal** (`/mentor/*`)
1. **Dashboard** (`/mentor/dashboard`)
2. **Escalated Complaints** (`/mentor/complaints`)
3. **Complaint Details** (`/mentor/complaint/:id`)
4. **Teachers Overview** (`/mentor/teachers`)
5. **Analytics** (`/mentor/analytics`)
6. **Profile** (`/mentor/profile`)

### **HOD Portal** (`/hod/*`)
1. **Dashboard** (`/hod/dashboard`)
2. **All Complaints** (`/hod/complaints`)
3. **Complaint Details** (`/hod/complaint/:id`)
4. **Manage Teachers** (`/hod/teachers`)
5. **Manage Mentors** (`/hod/mentors`)
6. **Manage Students** (`/hod/students`)
7. **Add Lateral Entry** (`/hod/lateral-entry`)
8. **Reports** (`/hod/reports`)
9. **System Settings** (`/hod/settings`)
10. **Profile** (`/hod/profile`)

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js (with Vite)
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** Redux Toolkit / Context API
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Charts:** Chart.js / Recharts
- **Notifications:** React Toastify
- **HTTP Client:** Axios
- **File Upload:** React Dropzone

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer (Gmail SMTP)
- **File Upload:** Multer + Cloudinary
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit
- **Environment:** dotenv

### **DevOps & Tools**
- **Version Control:** Git & GitHub
- **API Testing:** Postman
- **Code Editor:** VS Code
- **Package Manager:** npm

---

## 📁 Project Structure

```
ece-complaint-portal/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images, icons
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Buttons, Cards, Modals
│   │   │   ├── layout/              # Header, Footer, Sidebar
│   │   │   ├── forms/               # Form components
│   │   │   └── charts/              # Chart components
│   │   ├── pages/                   # Page components
│   │   │   ├── public/              # Landing, Login, Register
│   │   │   ├── student/             # Student portal pages
│   │   │   ├── teacher/             # Teacher portal pages
│   │   │   ├── mentor/              # Mentor portal pages
│   │   │   └── hod/                 # HOD portal pages
│   │   ├── context/                 # Context API
│   │   ├── hooks/                   # Custom hooks
│   │   ├── services/                # API services
│   │   ├── utils/                   # Helper functions
│   │   ├── routes/                  # Route configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js Backend
│   ├── config/                      # Configuration files
│   │   ├── db.js                    # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary config
│   │   └── email.js                 # Email config
│   ├── models/                      # Mongoose models
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Notification.js
│   │   ├── EmailLog.js
│   │   └── StudentPromotion.js
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── userController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── userRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── mentorRoutes.js
│   │   └── hodRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── roleCheck.js             # Role-based access
│   │   ├── upload.js                # File upload
│   │   └── errorHandler.js          # Error handling
│   ├── utils/                       # Utility functions
│   │   ├── emailTemplates.js        # Email templates
│   │   ├── generateId.js            # Complaint ID generator
│   │   ├── sendEmail.js             # Email sender
│   │   └── validators.js            # Custom validators
│   ├── server.js                    # Entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── PROJECT_PLAN.md
```

---

## 🔄 API Endpoints

### **Authentication Routes** (`/api/auth`)
- `POST /register` - Student registration
- `POST /login` - User login
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /me` - Get current user

### **Complaint Routes** (`/api/complaints`)
- `POST /` - Submit new complaint
- `GET /` - Get all complaints (role-based)
- `GET /:id` - Get complaint by ID
- `PUT /:id/status` - Update complaint status
- `PUT /:id/escalate` - Escalate complaint
- `PUT /:id/reopen` - Reopen complaint
- `POST /:id/feedback` - Submit feedback
- `GET /my-complaints` - Get user's complaints
- `GET /search/:complaintId` - Search by complaint ID

### **User Routes** (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /teachers` - Get all teachers (for dropdown)
- `GET /students` - Get students (teacher/hod)

### **Teacher Routes** (`/api/teacher`)
- `GET /complaints` - Get assigned complaints
- `GET /students` - Get assigned students
- `POST /students/promote` - Promote students
- `GET /dashboard-stats` - Get dashboard statistics
- `GET /teachers` - Get all teachers
- `POST /teachers` - Add new teacher
- `PUT /teachers/:id` - Update teacher details
- `POST /students/assign` - Assign students to teachers

### **Mentor Routes** (`/api/mentor`)
- `GET /complaints` - Get escalated complaints
- `GET /teachers` - Get assigned teachers
- `GET /dashboard-stats` - Get dashboard statistics

### **HOD Routes** (`/api/hod`)
- `POST /teachers` - Add new teacher
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Remove teacher
- `POST /mentors` - Add new mentor
- `POST /students` - Add new student
- `POST /students/lateral` - Add lateral entry student
- `POST /students/bulk-upload` - Bulk student upload
- `GET /reports` - Generate reports
- `GET /dashboard-stats` - Get system-wide statistics

### **Notification Routes** (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark as read
- `DELETE /:id` - Delete notification

---

## 📧 Email Notification Flow

### **Complaint Submission**
```
Student submits complaint
  ↓
System generates Complaint ID
  ↓
Email sent to:
  1. Student (Confirmation)
  2. Assigned Teacher (New complaint alert)
```

### **Status Update**
```
Teacher/Mentor/HOD updates status
  ↓
Email sent to:
  1. Student (Status update)
  2. Previous handler (if escalated)
```

### **Escalation**
```
Current handler escalates
  ↓
Email sent to:
  1. Student (Escalation notice)
  2. Next level handler (New escalated complaint)
  3. Previous handler (Escalation confirmation)
```

### **Resolution**
```
Handler marks as resolved
  ↓
Email sent to:
  1. Student (Resolution details + Feedback request)
```

### **Reopening**
```
Student reopens complaint
  ↓
Email sent to:
  1. Previous resolver (Reopen notification)
  2. Current handler (New reopened complaint)
```

---

## 🎯 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
- [ ] Project setup (client + server)
- [ ] Database schema design
- [ ] User authentication system
- [ ] Basic UI layout and routing
- [ ] JWT implementation

### **Phase 2: Core Features (Week 3-4)**
- [ ] Complaint submission form
- [ ] Three-level complaint management
- [ ] Status tracking system
- [ ] Email notification system
- [ ] File upload functionality

### **Phase 3: Role-Based Portals (Week 5-6)**
- [ ] Student portal (dashboard, my complaints, track)
- [ ] Teacher portal (complaints, students, promote)
- [ ] Mentor portal (escalated complaints, analytics)
- [ ] HOD portal (all features, management)

### **Phase 4: Advanced Features (Week 7-8)**
- [ ] Complaint reopening system
- [ ] Feedback and rating system
- [ ] Student promotion system
- [ ] Lateral entry registration
- [ ] Teacher management (HOD)

### **Phase 5: Analytics & Reports (Week 9)**
- [ ] Dashboard charts and statistics
- [ ] Report generation (Excel/PDF)
- [ ] Performance analytics
- [ ] Email logs and tracking

### **Phase 6: Testing & Deployment (Week 10)**
- [ ] Unit testing
- [ ] Integration testing
- [ ] Bug fixes and optimization
- [ ] Deployment (Vercel/Netlify + Render/Railway)
- [ ] Documentation

---

## 🔒 Security Considerations

1. **Authentication Security**
   - JWT tokens with expiration
   - Refresh token mechanism
   - Password strength validation
   - Rate limiting on login attempts

2. **Data Protection**
   - Input validation and sanitization
   - SQL injection prevention (using Mongoose)
   - XSS protection
   - CSRF protection

3. **File Upload Security**
   - File type validation (PDF, JPG, PNG, DOCX only)
   - File size limits (5MB per file, max 5 files)
   - Virus scanning (optional)
   - Secure storage (Cloudinary)

4. **Role-Based Access Control**
   - Middleware for role verification
   - Route protection
   - Data access restrictions

5. **Email Security**
   - Secure SMTP connection
   - Email verification
   - Rate limiting on email sending

6. **Anonymous Complaint Protection**
   - Student identity encrypted in database
   - Only HOD can decrypt and view actual identity
   - Email notifications sent without revealing identity
   - Audit log for identity access (who viewed anonymous complaint identity)

---

## 📊 Success Metrics

1. **User Adoption**
   - Number of registered students
   - Active users per month
   - Complaint submission rate

2. **Resolution Efficiency**
   - Average resolution time
   - Escalation rate
   - Reopening rate
   - Satisfaction rating

3. **System Performance**
   - Email delivery rate
   - System uptime
   - Response time
   - Error rate

---

## 🚀 Future Enhancements

1. **Mobile App** (React Native)
2. **AI Chatbot** for FAQ and guidance
3. **SMS Notifications** (Twilio)
4. **Push Notifications** (Firebase)
5. **Multi-language Support**
6. **Dark Mode**
7. **Advanced Analytics** (ML-based insights)
8. **Integration with College ERP**
9. **QR Code for complaint tracking**
10. **Voice complaint submission**

---

## 📝 Notes

- All timestamps in IST (Indian Standard Time)
- Academic year format: 2024-2025
- Complaint ID format: ECE-COMP-YYYY-XXXX
- Email templates customizable by HOD
- System supports up to 4 years of B.Tech ECE
- Lateral entry students can register for 2nd year only
- Student promotion happens at year-end (teacher-initiated)

---

## ✅ Checklist for Development

- [ ] Setup development environment
- [ ] Initialize Git repository
- [ ] Create MongoDB database
- [ ] Setup email service (Gmail SMTP)
- [ ] Setup Cloudinary account
- [ ] Install all dependencies
- [ ] Create .env files
- [ ] Design database schemas
- [ ] Implement authentication
- [ ] Build complaint system
- [ ] Implement email notifications
- [ ] Create role-based portals
- [ ] Add student management
- [ ] Add teacher management
- [ ] Implement analytics
- [ ] Testing and debugging
- [ ] Deployment

---

**End of Project Plan**
