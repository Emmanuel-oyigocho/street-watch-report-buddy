
import React from 'react';
import { Report } from '../types';

interface ReportCardProps {
  report: Report;
  isAdmin?: boolean;
  onReportUpdate?: (reportId: string, updates: Partial<Report>) => void;
  onReportDelete?: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  isAdmin = false,
  onReportUpdate,
  onReportDelete
}) => {
  const handleStatusToggle = () => {
    if (onReportUpdate) {
      onReportUpdate(report.id, {
        status: report.status === 'pending' ? 'resolved' : 'pending'
      });
    }
  };

  const handleDelete = () => {
    if (onReportDelete && window.confirm('Are you sure you want to delete this report?')) {
      onReportDelete(report.id);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{report.hazardType}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            report.status === 'resolved'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {report.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        <strong>Location:</strong> {report.location}
      </p>

      <p className="text-sm text-gray-700 mb-3">
        {report.description}
      </p>

      {report.imageUrl && (
        <div className="mb-3">
          <img
            src={report.imageUrl}
            alt="Hazard"
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="text-xs text-gray-500 mb-3">
        <div>Reported by: {report.submittedBy}</div>
        <div>Date: {formatDate(report.timestamp)}</div>
      </div>

      {isAdmin && (onReportUpdate || onReportDelete) && (
        <div className="flex justify-end space-x-2 pt-2 border-t">
          {onReportUpdate && (
            <button
              onClick={handleStatusToggle}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                report.status === 'pending'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              Mark as {report.status === 'pending' ? 'Resolved' : 'Pending'}
            </button>
          )}
          {onReportDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
