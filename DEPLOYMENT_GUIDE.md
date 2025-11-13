# ECE Complaint Portal - Deployment Guide

## 🚀 Deployment Overview

This guide will help you deploy your ECE Complaint Portal to production with full functionality including database, email notifications, and file uploads.

---

## 📋 Prerequisites

### **Required Accounts & Services:**
1. **MongoDB Atlas** (Database) - Free tier available
2. **Gmail Account** (Email notifications) - App password required
3. **Cloudinary** (File uploads) - Free tier available
4. **Render** (Backend hosting) - Free tier available
5. **Vercel** (Frontend hosting) - Free tier available

---

## 🗄️ Step 1: Setup MongoDB Atlas

### **1. Create MongoDB Atlas Account**
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Sign up for free account
- Create a new project: "ECE Complaint Portal"

### **2. Create Database Cluster**
- Choose "Free" tier
- Select AWS/Google Cloud/Azure (any region)
- Cluster name: "ece-portal-cluster"
- Wait for cluster to be created (~5 minutes)

### **3. Create Database User**
- Go to "Database Access" → "Add New Database User"
- Username: `eceportaluser`
- Password: `your_secure_password_here`
- Built-in Role: `Read and write to any database`

### **4. Whitelist IP Address**
- Go to "Network Access" → "Add IP Address"
- Add IP: `0.0.0/0` (Allow access from anywhere)
- Description: "Allow all IPs for development"

### **5. Get Connection String**
- Go to "Clusters" → "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<database>` with `ece-complaint-portal`

**Your connection string should look like:**
```
mongodb+srv://eceportaluser:your_password@ece-portal-cluster.xxxxx.mongodb.net/ece-complaint-portal?retryWrites=true&w=majority
```

---

## 📧 Step 2: Setup Gmail for Email Notifications

### **1. Enable 2-Factor Authentication**
- Go to [myaccount.google.com](https://myaccount.google.com)
- Security → 2-Step Verification → Enable

### **2. Generate App Password**
- Go to Security → App passwords
- Select app: "Mail"
- Select device: "Other (custom name)"
- Enter: "ECE Complaint Portal"
- Copy the 16-character password

### **3. Configure Email Settings**
- EMAIL_USER: `your_email@gmail.com`
- EMAIL_PASSWORD: `your_16_character_app_password`

---

## ☁️ Step 3: Setup Cloudinary for File Uploads

### **1. Create Cloudinary Account**
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for free account
- Verify your email

### **2. Get API Credentials**
- Go to Dashboard → Account Details
- Copy:
  - Cloud name
  - API Key
  - API Secret

### **3. Configure Upload Settings**
- Go to Settings → Upload
- Upload presets: Create new preset
- Name: `ece-portal-uploads`
- Mode: `Unsigned` (for simplicity)
- Folder: `ece-complaints/`
- Allowed formats: `jpg,png,jpeg,pdf,doc,docx`
- Max file size: `10000000` (10MB)

---

## 🔧 Step 4: Configure Environment Variables

### **Backend (.env file)**
Update your `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration (Production)
MONGODB_URI=mongodb+srv://eceportaluser:your_password@ece-portal-cluster.xxxxx.mongodb.net/ece-complaint-portal?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
EMAIL_FROM=ECE Complaint Portal <noreply@eceportal.com>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (Update after deploying frontend)
CLIENT_URL=https://ece-complaint-portal2.vercel.app

# Encryption Key for Anonymous Complaints
ENCRYPTION_KEY=32_character_encryption_key_for_anonymous_complaints_12345678901234567890123456789012
```

---

## 🚀 Step 5: Deploy Backend (Render)

### **1. Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub or email
- Connect your GitHub account

### **2. Deploy Backend**
- Click "New" → "Web Service"
- Connect your GitHub repository
- Configure service:
  - **Name**: `ece-complaint-portal-backend`
  - **Root Directory**: `server`
  - **Runtime**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

### **3. Add Environment Variables**
- Go to Environment → Add Environment Variable
- Add all variables from your `server/.env` file:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `MONGODB_URI=mongodb+srv://eceportaluser:your_password@ece-portal-cluster.xxxxx.mongodb.net/ece-complaint-portal?retryWrites=true&w=majority`
  - `JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789`
  - `JWT_EXPIRE=7d`
  - `EMAIL_HOST=smtp.gmail.com`
  - `EMAIL_PORT=587`
  - `EMAIL_USER=your_email@gmail.com`
  - `EMAIL_PASSWORD=your_16_character_app_password`
  - `EMAIL_FROM=ECE Complaint Portal <noreply@eceportal.com>`
  - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
  - `CLOUDINARY_API_KEY=your_api_key`
  - `CLOUDINARY_API_SECRET=your_api_secret`
  - `CLIENT_URL=https://ece-complaint-portal2.vercel.app`
  - `ENCRYPTION_KEY=32_character_encryption_key_for_anonymous_complaints_12345678901234567890123456789012`

### **4. Get Backend URL**
- After deployment, copy the generated URL
- Example: `https://ece-complaint-portal-backend.onrender.com`

---

## 🌐 Step 6: Deploy Frontend (Vercel)

### **1. Create Vercel Account**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Connect your GitHub account

### **2. Deploy Frontend**
- Click "Add New..." → "Project"
- Import your GitHub repository
- Configure project:
  - **Framework Preset**: `Vite`
  - **Root Directory**: `client`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### **3. Add Environment Variables**
- Go to Project Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.onrender.com`

### **4. Update Backend CLIENT_URL**
- Update your Render environment variable:
- `CLIENT_URL=https://ece-complaint-portal2.vercel.app`

---

## 🔄 Step 7: Update API Base URL

### **Frontend API Configuration**
Update `client/src/services/api.js`:

```javascript
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ece-complaint-portal-backend.onrender.com';

export default API_BASE_URL;
```

---

## 🧪 Step 8: Testing Production Deployment

### **1. Test Frontend**
- Visit your Vercel URL
- Check if all pages load correctly
- Test navigation between different portals

### **2. Test Authentication**
- Try registering a new student
- Test login functionality
- Verify JWT tokens work

### **3. Test Complaint System**
- Submit a test complaint
- Check if email notifications are sent
- Test file uploads to Cloudinary

### **4. Test Database**
- Verify data is saved to MongoDB Atlas
- Check if all collections are created

---

## 🔧 Step 9: Production Optimizations

### **1. Database Indexes**
Add these indexes to MongoDB for better performance:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ year: 1 });

// Complaints collection
db.complaints.createIndex({ studentId: 1 });
db.complaints.createIndex({ assignedTo: 1 });
db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ complaintId: 1 }, { unique: true });
db.complaints.createIndex({ createdAt: -1 });
```

### **2. Rate Limiting**
Already configured in backend with `express-rate-limit`

### **3. CORS Configuration**
Update CORS in `server/server.js`:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### **4. Security Headers**
Already configured with `helmet` middleware

---

## 📊 Step 10: Monitoring & Maintenance

### **1. Database Monitoring**
- MongoDB Atlas Dashboard → Performance
- Monitor connection count and query performance

### **2. Application Monitoring**
- Render Dashboard → Logs
- Vercel Dashboard → Functions & Analytics

### **3. Email Monitoring**
- Check Gmail sent items for notification emails
- Monitor bounce rates and delivery issues

### **4. Backup Strategy**
- MongoDB Atlas → Backup → Enable automated backups
- Schedule: Daily backups

---

## 🆘 Troubleshooting

### **Common Issues:**

#### **1. Database Connection Failed**
- Check MongoDB Atlas IP whitelist
- Verify connection string credentials
- Ensure database user has correct permissions

#### **2. Email Not Sending**
- Verify Gmail app password is correct
- Check Gmail security settings
- Ensure 2FA is enabled

#### **3. File Upload Failed**
- Check Cloudinary credentials
- Verify upload preset configuration
- Check file size limits

#### **4. CORS Errors**
- Update CLIENT_URL in backend environment
- Ensure frontend API_BASE_URL is correct

#### **5. JWT Token Issues**
- Check JWT_SECRET is consistent
- Verify token expiration settings

---

## 💰 Cost Estimation (Free Tier)

| Service | Free Tier Limits | Cost if Exceeded |
|---------|------------------|------------------|
| MongoDB Atlas | 512MB storage | $0.08/GB/month |
| Cloudinary | 25GB storage, 25GB monthly | $0.01/GB |
| Render | 750 hours/month, 750MB RAM | $7/month |
| Vercel | 100GB bandwidth/month | $20/month |
| Gmail | 500 emails/day | N/A (use SendGrid) |

**Total Estimated Cost:** $0/month (staying within free tiers)

---

## 🎯 Next Steps After Deployment

1. **Create Admin Account**
   - Register HOD account manually in database
   - Use MongoDB Atlas to create first HOD user

2. **Configure System Settings**
   - Set up email templates
   - Configure complaint categories
   - Set up department information

3. **User Onboarding**
   - Create teacher accounts
   - Assign students to teachers
   - Set up mentor assignments

4. **Testing Complete Workflow**
   - Student registration → Complaint submission → Email notifications
   - Teacher response → Escalation → HOD resolution
   - Feedback system → Analytics dashboard

---

## 📞 Support & Resources

### **Documentation Links:**
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Render Docs](https://docs.render.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)

### **Help Resources:**
- Render Community: [render.com/docs/community](https://render.com/docs/community)
- Vercel Forums: [vercel.com/docs/community](https://vercel.com/docs/community)
- MongoDB Community: [mongodb.com/community](https://mongodb.com/community)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Database cluster configured
- [ ] Gmail app password generated
- [ ] Cloudinary account set up
- [ ] Environment variables configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] API URLs updated
- [ ] Database indexes created
- [ ] Authentication tested
- [ ] Email notifications tested
- [ ] File uploads tested
- [ ] All portals accessible
- [ ] Mobile responsiveness verified

---

**🎉 Congratulations! Your ECE Complaint Portal is now live and fully functional!**

**Access your application at:** `https://ece-complaint-portal2.vercel.app`
