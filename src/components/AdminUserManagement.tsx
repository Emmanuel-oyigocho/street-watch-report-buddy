
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, User } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoting, setPromoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as Profile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail.trim()) return;

    setPromoting(true);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', {
        user_email: promoteEmail.trim()
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "User promoted to admin successfully",
        });
        setPromoteEmail('');
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "User not found with that email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive",
      });
    } finally {
      setPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Promote User to Admin</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={promoteToAdmin} className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter user email to promote"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={promoting || !promoteEmail.trim()}>
              {promoting ? 'Promoting...' : 'Promote to Admin'}
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-2">
            Enter the email address of an existing user to promote them to admin status.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
