import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Navigate } from 'react-router-dom';

// A simple component for displaying a stat card
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast({
          title: "Access Denied or Error",
          description: "Could not fetch admin statistics. You may not have the required permissions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  // Client-side protection: if the user is not an admin, redirect them away.
  // The primary protection is on the backend API, but this improves UX.
  if (user && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and statistics.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-20"><Loader2 className="h-10 w-10 animate-spin" /></div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
          <StatCard title="Total Requests" value={stats.totalRequests} icon={Heart} />
          <StatCard title="Active Requests" value={stats.activeRequests} icon={AlertCircle} />
          <StatCard title="Fulfilled Requests" value={stats.fulfilledRequests} icon={CheckCircle} />
        </div>
      ) : (
        <p className="text-center text-destructive">Could not load statistics.</p>
      )}

      {/* In the future, we can add tables for managing users and requests here */}
    </div>
  );
};

export default AdminDashboard;