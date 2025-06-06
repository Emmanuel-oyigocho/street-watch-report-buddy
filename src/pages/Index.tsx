
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { User, Report } from '../types';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load reports from localStorage
    const savedReports = localStorage.getItem('hazardReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleReportSubmit = (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('hazardReports', JSON.stringify(updatedReports));
  };

  const handleReportUpdate = (reportId: string, updates: Partial<Report>) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, ...updates } : report
    );
    setReports(updatedReports);
    localStorage.setItem('hazardReports', JSON.stringify(updatedReports));
  };

  const handleReportDelete = (reportId: string) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('hazardReports', JSON.stringify(updatedReports));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Street Hazard Reporting System
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.username} ({currentUser.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'admin' ? (
          <AdminDashboard
            reports={reports}
            onReportUpdate={handleReportUpdate}
            onReportDelete={handleReportDelete}
          />
        ) : (
          <UserDashboard
            user={currentUser}
            reports={reports.filter(report => report.submittedBy === currentUser.username)}
            onReportSubmit={handleReportSubmit}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
