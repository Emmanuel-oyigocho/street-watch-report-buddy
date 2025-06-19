import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import AppSidebar from '../components/AppSidebar';
import { Report, Profile, DatabaseReport } from '../types';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentView, setCurrentView] = useState<'user' | 'admin'>('user');
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchReports();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } else {
      setProfile(data as Profile);
    }
  };

  const fetchReports = async () => {
    if (!user) return;

    let query = supabase
      .from('reports')
      .select('*')
      .order('timestamp', { ascending: false });

    // If user is not admin, only show their own reports
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileData?.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } else {
      // Transform database reports to frontend format
      const transformedReports: Report[] = (data as DatabaseReport[]).map(dbReport => ({
        id: dbReport.id,
        location: dbReport.location,
        hazardType: dbReport.hazard_type,
        description: dbReport.description,
        imageUrl: dbReport.image_url,
        submittedBy: dbReport.submitted_by,
        timestamp: dbReport.timestamp,
        status: dbReport.status as 'pending' | 'resolved',
      }));
      setReports(transformedReports);
    }
  };

  const handleReportSubmit = async (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        location: reportData.location,
        hazard_type: reportData.hazardType,
        description: reportData.description,
        image_url: reportData.imageUrl,
        submitted_by: profile.username,
      });

    if (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
      fetchReports();
    }
  };

  const handleReportUpdate = async (reportId: string, updates: Partial<Report>) => {
    const { error } = await supabase
      .from('reports')
      .update({
        status: updates.status,
      })
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Report updated successfully",
      });
      fetchReports();
    }
  };

  const handleReportDelete = async (reportId: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
      fetchReports();
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      navigate('/auth');
    }
  };

  const handleViewChange = (view: 'user' | 'admin') => {
    setCurrentView(view);
    setActiveSection('dashboard'); // Reset to dashboard when switching views
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const userForDashboard = {
    username: profile.username,
    role: profile.role,
  };

  const reportsForDashboard = reports.map(report => ({
    id: report.id,
    location: report.location,
    hazardType: report.hazardType,
    description: report.description,
    imageUrl: report.imageUrl,
    submittedBy: report.submittedBy,
    timestamp: report.timestamp,
    status: report.status as 'pending' | 'resolved',
  }));

  // Filter reports based on active section
  const getFilteredReports = () => {
    if (activeSection === 'my-reports') {
      return reportsForDashboard.filter(report => report.submittedBy === profile.username);
    }
    return reportsForDashboard;
  };

  const getPageTitle = () => {
    if (activeSection === 'my-reports') return 'My Reports';
    if (activeSection === 'all-reports') return 'All Reports';
    if (activeSection === 'user-management') return 'User Management';
    if (activeSection === 'settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          user={userForDashboard}
          onLogout={handleLogout}
          currentView={currentView}
          onViewChange={handleViewChange}
          onNavigate={handleNavigation}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold text-gray-900">
                    {getPageTitle()}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {profile.username} ({currentView === 'admin' && profile.role === 'admin' ? 'Admin View' : 'User View'})
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {currentView === 'admin' && profile.role === 'admin' ? (
              <AdminDashboard
                reports={getFilteredReports()}
                onReportUpdate={handleReportUpdate}
                onReportDelete={handleReportDelete}
              />
            ) : (
              <UserDashboard
                user={userForDashboard}
                reports={getFilteredReports()}
                onReportSubmit={handleReportSubmit}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
