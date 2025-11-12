import { Link } from 'react-router-dom';

const HodComplaintDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
              <p className="mt-1 text-sm text-gray-500">
                Final authority review and resolution
              </p>
            </div>
            <Link
              to="/hod/complaints"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Complaints
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                HOD Complaint Details Page Under Development
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This page will provide HOD with complete complaint oversight and final authority. Features include:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>View complete complaint history and all resolution attempts</li>
                  <li>Access anonymous complaint identities (with audit logging)</li>
                  <li>Override any previous decisions and assignments</li>
                  <li>Final resolution authority with detailed notes</li>
                  <li>Communicate directly with students, teachers, and mentors</li>
                  <li>Generate official resolution documents</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HodComplaintDetails;
