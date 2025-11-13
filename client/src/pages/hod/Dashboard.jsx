import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const HodDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    escalatedComplaints: 0,
    teacherCount: 0,
    mentorCount: 0,
    studentCount: 0,
  });
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, registrationsResponse] = await Promise.all([
        api.get('/api/hod/dashboard-stats'),
        api.get('/api/hod/pending-registrations'),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (registrationsResponse.data.success) {
        setPendingRegistrations(registrationsResponse.data.pendingUsers);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRegistration = async (userId) => {
    try {
      const response = await api.put(`/api/hod/approve-registration/${userId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve registration');
    }
  };

  const handleRejectRegistration = async (userId) => {
    const reason = prompt('Enter reason for rejection (optional):');
    try {
      const response = await api.put(`/api/hod/reject-registration/${userId}`, { reason });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject registration');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete oversight of ECE Department complaint management
              </p>
            </div>
            <Link
              to="/student/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Switch to Student View
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Complaints
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalComplaints}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/hod/complaints"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  View all complaints
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Teachers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.teacherCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/hod/teachers"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Manage teachers
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.studentCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/hod/students"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Manage students
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">R</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Reports
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">Generate</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/hod/reports"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Registrations Section */}
        {pendingRegistrations.length > 0 && (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Pending Faculty Registrations ({pendingRegistrations.length})
                </h3>
                <div className="space-y-4">
                  {pendingRegistrations.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • Employee ID: {user.employeeId}
                          </p>
                          {user.specialization && (
                            <p className="text-sm text-gray-600">Specialization: {user.specialization}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Registered: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveRegistration(user.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(user.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/hod/lateral-entry"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  Add Lateral Entry Student
                </Link>
                <Link
                  to="/hod/settings"
                  className="block w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-center"
                >
                  System Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                System Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Complaints</span>
                  <span className="text-sm font-medium text-gray-900">{stats.pendingComplaints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolved Complaints</span>
                  <span className="text-sm font-medium text-gray-900">{stats.resolvedComplaints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Escalated Complaints</span>
                  <span className="text-sm font-medium text-gray-900">{stats.escalatedComplaints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Mentors</span>
                  <span className="text-sm font-medium text-gray-900">{stats.mentorCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HodDashboard;
