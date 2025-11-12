import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TrackComplaint = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/complaints/search/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setComplaint(response.data.complaint);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Complaint not found');
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

  const getStatusStep = (status) => {
    const steps = ['Pending', 'In Review', 'Resolved'];
    return steps.indexOf(status) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Track Complaint</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Complaint ID: {complaintId}
                </p>
              </div>
              <Link
                to="/student/my-complaints"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to My Complaints
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Complaint Not Found
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link
                      to="/student/my-complaints"
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      View My Complaints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
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
              <h1 className="text-3xl font-bold text-gray-900">Track Complaint</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complaint ID: {complaint.complaintId}
              </p>
            </div>
            <Link
              to="/student/my-complaints"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to My Complaints
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Complaint Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Complaint Details
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Complaint ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{complaint.complaintId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{complaint.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd className="mt-1 text-sm text-gray-900">{complaint.priority}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Submitted Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                {complaint.isAnonymous && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Privacy</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Anonymous Complaint
                      </span>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{complaint.title}</dd>
              </div>

              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {complaint.description}
                </dd>
              </div>

              {/* Attachments */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Attachments</dt>
                  <dd className="mt-1">
                    <ul className="space-y-2">
                      {complaint.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 text-sm underline"
                          >
                            {attachment.name || `Attachment ${index + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Complaint Timeline
              </h3>

              <div className="flow-root">
                <ul className="-mb-8">
                  {complaint.resolutionNotes && complaint.resolutionNotes.map((note, noteIdx) => (
                    <li key={noteIdx}>
                      <div className="relative pb-8">
                        {noteIdx !== complaint.resolutionNotes.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {note.resolvedBy?.name || 'System'}
                              </span>
                              {' '}
                              <span className="capitalize">{note.action}</span>
                              {' '}
                              <time dateTime={note.timestamp}>
                                {new Date(note.timestamp).toLocaleDateString()} at{' '}
                                {new Date(note.timestamp).toLocaleTimeString()}
                              </time>
                            </p>
                            <p className="mt-2 text-sm text-gray-700">{note.note}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}

                  {/* Initial submission */}
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">You</span>
                            {' '}
                            submitted the complaint
                            {' '}
                            <time dateTime={complaint.createdAt}>
                              {new Date(complaint.createdAt).toLocaleDateString()} at{' '}
                              {new Date(complaint.createdAt).toLocaleTimeString()}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          {complaint.status === 'Resolved' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Complaint Resolved
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your complaint has been resolved. If you're not satisfied with the resolution,
                  you can reopen this complaint.
                </p>
                <div className="flex space-x-4">
                  <Link
                    to={`/student/feedback/${complaint._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Rate & Provide Feedback
                  </Link>
                  <button
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                    onClick={() => {
                      // TODO: Implement reopen complaint functionality
                      alert('Reopen functionality will be implemented');
                    }}
                  >
                    Reopen Complaint
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackComplaint;
