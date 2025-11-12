import { Link } from 'react-router-dom';

const TeacherStudents = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage students assigned to you
              </p>
            </div>
            <Link
              to="/teacher/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
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
                Teacher Students Page Under Development
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This page will show all students assigned to you as a teacher. You'll be able to:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>View students organized by year (1st, 2nd, 3rd, 4th)</li>
                  <li>Filter and search students by name or roll number</li>
                  <li>Promote students to the next year</li>
                  <li>View student complaint history</li>
                  <li>Assign students to different teachers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherStudents;
