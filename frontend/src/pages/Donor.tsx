import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Loader2 } from "lucide-react";

// Validation schema for updating a user's profile
const profileSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  location: z.string().min(3, "Location is required."),
});

const DonorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    // Pre-fill the form with the current user's data
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
    },
  });

  // Fetch all active requests when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/requests');
        setRequests(data.requests);
        setPagination(data.pagination);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch blood requests.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [toast]);

  // Handle form submission to update the user's profile
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      await api.put('/users/me', values);
      toast({ title: "Success", description: "Your profile has been updated." });
      // In a real app, you might want to refresh the global user state here
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.error || "Could not update your profile.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        <p className="text-muted-foreground">Update your profile and browse active blood requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Update Profile Form */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Users className="h-5 w-5" /><span>Update Your Profile</span></CardTitle>
              <CardDescription>Keep your information up to date.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Your Location</FormLabel><FormControl><Input placeholder="e.g., Bhopal, MP" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Blood Requests */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Heart className="h-5 w-5 text-medical-red" /><span>Active Blood Requests</span></CardTitle>
              <CardDescription>Patients in need of your help.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req: any) => (
                    <Card key={req._id} className="p-4">
                       <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-lg text-medical-red border-medical-red">{req.bloodType}</Badge>
                          <span className="font-medium text-sm">from {req.userId?.name || 'A Patient'}</span>
                        </div>
                        <Badge variant={req.urgency === 'high' ? 'destructive' : 'secondary'}>{req.urgency.toUpperCase()}</Badge>
                      </div>
                      <p className="font-semibold text-lg mb-3">{req.location}</p>
                      <Button className="w-full" asChild>
                        <Link to={`/requests/${req._id}`}>View Details & Respond</Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">No active requests right now. Thank you!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
