import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import TrackComplaint from './pages/student/TrackComplaint';
import StudentProfile from './pages/student/Profile';
import Feedback from './pages/student/Feedback';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherComplaints from './pages/teacher/Complaints';
import TeacherComplaintDetails from './pages/teacher/ComplaintDetails';
import TeacherStudents from './pages/teacher/Students';
import PromoteStudents from './pages/teacher/PromoteStudents';
import ManageTeachers from './pages/teacher/ManageTeachers';
import AddTeacher from './pages/teacher/AddTeacher';
import AssignStudents from './pages/teacher/AssignStudents';
import TeacherProfile from './pages/teacher/Profile';

// Mentor Pages
import MentorDashboard from './pages/mentor/Dashboard';
import MentorComplaints from './pages/mentor/Complaints';
import MentorComplaintDetails from './pages/mentor/ComplaintDetails';
import MentorTeachers from './pages/mentor/Teachers';
import MentorAnalytics from './pages/mentor/Analytics';
import MentorProfile from './pages/mentor/Profile';

// HOD Pages
import HodDashboard from './pages/hod/Dashboard';
import HodComplaints from './pages/hod/Complaints';
import HodComplaintDetails from './pages/hod/ComplaintDetails';
import HodTeachers from './pages/hod/Teachers';
import HodMentors from './pages/hod/Mentors';
import HodStudents from './pages/hod/Students';
import AddLateralEntry from './pages/hod/AddLateralEntry';
import HodReports from './pages/hod/Reports';
import HodSettings from './pages/hod/Settings';
import HodProfile from './pages/hod/Profile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit-complaint"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <SubmitComplaint />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-complaints"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <MyComplaints />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/track/:complaintId"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <TrackComplaint />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/feedback/:complaintId"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['student']}>
                  <Feedback />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/complaints"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherComplaints />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/complaint/:id"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherComplaintDetails />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherStudents />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/promote-students"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <PromoteStudents />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/manage-teachers"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <ManageTeachers />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/add-teacher"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <AddTeacher />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assign-students"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <AssignStudents />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['teacher']}>
                  <TeacherProfile />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Mentor Routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/complaints"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorComplaints />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/complaint/:id"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorComplaintDetails />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/teachers"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorTeachers />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/analytics"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorAnalytics />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/profile"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['mentor']}>
                  <MentorProfile />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* HOD Routes */}
          <Route
            path="/hod/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/complaints"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodComplaints />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/complaint/:id"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodComplaintDetails />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/teachers"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodTeachers />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/mentors"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodMentors />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/students"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodStudents />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/lateral-entry"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <AddLateralEntry />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/reports"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodReports />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/settings"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodSettings />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/profile"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hod']}>
                  <HodProfile />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900">404</h1><p className="text-gray-600">Page not found</p></div></div>} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
