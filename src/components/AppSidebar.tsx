
import React from 'react';
import { Home, FileText, Settings, User, LogOut, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface AppSidebarProps {
  user: {
    username: string;
    role: 'user' | 'admin';
  };
  onLogout: () => void;
  currentView: 'user' | 'admin';
  onViewChange: (view: 'user' | 'admin') => void;
  onNavigate: (section: string) => void;
}

const AppSidebar = ({ user, onLogout, currentView, onViewChange, onNavigate }: AppSidebarProps) => {
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      key: 'dashboard',
    },
    {
      title: 'My Reports',
      icon: FileText,
      key: 'my-reports',
    },
    {
      title: 'Settings',
      icon: Settings,
      key: 'settings',
    },
  ];

  const adminItems = [
    {
      title: 'All Reports',
      icon: Shield,
      key: 'all-reports',
    },
    {
      title: 'User Management',
      icon: User,
      key: 'user-management',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Hazard Reporter</h2>
            <p className="text-xs text-muted-foreground">Street Safety</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>View Mode</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User View</span>
                  <Switch
                    checked={currentView === 'admin'}
                    onCheckedChange={(checked) => onViewChange(checked ? 'admin' : 'user')}
                  />
                  <span className="text-sm">Admin View</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentView === 'admin' ? 'Viewing as Admin' : 'Viewing as User'}
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => onNavigate(item.key)}
                      className="flex items-center w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentView === 'admin' && user.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button 
                        onClick={() => onNavigate(item.key)}
                        className="flex items-center w-full"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2">
              <div className="text-sm font-medium">{user.username}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {user.role}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
