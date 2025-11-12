import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/complaints/my-complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Escalated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'all') return true;
    return complaint.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and track all your submitted complaints
              </p>
            </div>
            <Link
              to="/student/submit-complaint"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit New Complaint
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Complaints</option>
              <option value="pending">Pending</option>
              <option value="in review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Complaints', count: complaints.length },
                  { key: 'pending', label: 'Pending', count: complaints.filter(c => c.status === 'Pending').length },
                  { key: 'in review', label: 'In Review', count: complaints.filter(c => c.status === 'In Review').length },
                  { key: 'resolved', label: 'Resolved', count: complaints.filter(c => c.status === 'Resolved').length },
                  { key: 'rejected', label: 'Rejected', count: complaints.filter(c => c.status === 'Rejected').length },
                  { key: 'escalated', label: 'Escalated', count: complaints.filter(c => c.status === 'Escalated').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredComplaints.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <li key={complaint._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {complaint.title}
                          </p>
                          {complaint.isAnonymous && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Anonymous
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          ID: {complaint.complaintId}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Category: {complaint.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                        <Link
                          to={`/student/track/${complaint.complaintId}`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? "You haven't submitted any complaints yet."
                  : `No complaints with status "${filter}".`
                }
              </p>
              <div className="mt-6">
                <Link
                  to="/student/submit-complaint"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit Your First Complaint
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <Link
            to="/student/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyComplaints;
