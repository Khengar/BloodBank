import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, PlusCircle, MapPin } from "lucide-react";

// 1. Validation schema for a new blood request
const requestSchema = z.object({
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], { required_error: "Blood type is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  contact: z.string().min(10, { message: "A valid contact number is required." }),
  urgency: z.enum(['low', 'medium', 'high']),
  description: z.string().max(500, "Description cannot exceed 500 characters.").optional(),
});

const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { urgency: 'medium', contact: user?.phone || '', location: user?.location || '', description: '' },
  });

  // 2. Function to fetch the user's requests from the backend
  const fetchMyRequests = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/requests/my');
      setMyRequests(data.requests);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch your request history.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch requests when the component loads
  useEffect(() => {
    fetchMyRequests();
  }, []);

  // 3. Handle form submission to create a new request via the API
  async function onSubmit(values: z.infer<typeof requestSchema>) {
    try {
      await api.post('/requests', values);
      toast({ title: "Success!", description: "Your blood request has been posted." });
      form.reset();
      fetchMyRequests(); // Refresh the list of requests
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.error || "Could not post your request.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Request and track blood donations here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Request Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><span>Create Blood Request</span></CardTitle>
            <CardDescription>Fill in the details to request blood from our network.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* --- START OF IMPLEMENTED FORM FIELDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="bloodType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a blood type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="urgency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Hospital *</FormLabel>
                    <FormControl><Input placeholder="e.g., AIIMS, Bhopal" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="contact" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
                    <FormControl><Input placeholder="Your phone number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="Any additional details..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                {/* --- END OF IMPLEMENTED FORM FIELDS --- */}
                <Button type="submit" className="w-full shadow-medical" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Blood Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Request Status & History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5 text-medical-blue" /><span>Your Request History</span></CardTitle>
            <CardDescription>Track the status of your current and past requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map((req: any) => (
                  <div key={req._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-medical-red border-medical-red">{req.bloodType}</Badge>
                        <Badge variant={req.urgency === "high" ? "destructive" : "secondary"}>{req.urgency}</Badge>
                      </div>
                      <Badge variant={req.isActive ? "outline" : "default"} className={req.isActive ? "text-green-600 border-green-600" : ""}>
                        {req.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center"><MapPin className="h-3 w-3 mr-2" />{req.location}</p>
                      <p>Posted on: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">You have not made any requests yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;