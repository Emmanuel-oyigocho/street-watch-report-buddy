
import React, { useState } from 'react';
import { User, Report, ReportFormData } from '../types';
import ReportForm from './ReportForm';
import ReportCard from './ReportCard';

interface UserDashboardProps {
  user: User;
  reports: Report[];
  onReportSubmit: (report: ReportFormData) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, reports, onReportSubmit }) => {
  const [showForm, setShowForm] = useState(false);

  const handleReportSubmit = (reportData: Omit<ReportFormData, 'submittedBy'>) => {
    onReportSubmit({
      ...reportData,
      submittedBy: user.username
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Report a Street Hazard
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {showForm ? 'Cancel' : 'New Report'}
          </button>
        </div>

        {showForm && (
          <ReportForm
            onSubmit={handleReportSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          My Reports ({reports.length})
        </h2>

        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reports submitted yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Click "New Report" to submit your first hazard report.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
