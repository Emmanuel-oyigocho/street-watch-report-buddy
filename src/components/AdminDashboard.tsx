
import React, { useState } from 'react';
import { Report } from '../types';
import ReportCard from './ReportCard';

interface AdminDashboardProps {
  reports: Report[];
  onReportUpdate: (reportId: string, updates: Partial<Report>) => void;
  onReportDelete: (reportId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports,
  onReportUpdate,
  onReportDelete
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Admin Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
            <div className="text-sm text-blue-800">Total Reports</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <div className="text-sm text-green-800">Resolved</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {filter === 'all' ? 'All Reports' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Reports`} 
          ({filteredReports.length})
        </h3>

        {filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reports found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isAdmin={true}
                onReportUpdate={onReportUpdate}
                onReportDelete={onReportDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
