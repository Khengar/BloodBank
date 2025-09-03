import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, User, MapPin, Phone, MessageSquare, AlertTriangle } from 'lucide-react';

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the request ID from the URL
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data } = await api.get(`/requests/${id}`);
        setRequest(data.request);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch request details.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestDetails();
  }, [id, toast]);

  if (isLoading) {
    return <div className="flex justify-center pt-20"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  if (!request) {
    return <div className="text-center pt-20">
      <h2 className="text-xl font-semibold">Request not found</h2>
      <p className="text-muted-foreground">This request may have been fulfilled or removed.</p>
      <Button asChild className="mt-4"><Link to="/donor">Go Back</Link></Button>
    </div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link to="/donor"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">Blood Request: {request.bloodType}</CardTitle>
              <CardDescription>Posted on {new Date(request.createdAt).toLocaleString()}</CardDescription>
            </div>
            <Badge variant={request.urgency === 'high' ? 'destructive' : 'secondary'} className="text-lg">
              <AlertTriangle className="mr-2 h-4 w-4"/> {request.urgency.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div className="space-y-3">
              <p className="flex items-center"><User className="mr-3 h-5 w-5 text-muted-foreground" /> <strong>Patient:</strong> {request.userId?.name || 'Anonymous'}</p>
              <p className="flex items-center"><MapPin className="mr-3 h-5 w-5 text-muted-foreground" /> <strong>Location:</strong> {request.location}</p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center"><Phone className="mr-3 h-5 w-5 text-muted-foreground" /> <strong>Contact:</strong> {request.contact}</p>
              {request.description && <p className="flex items-start"><MessageSquare className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" /> <strong>Details:</strong> {request.description}</p>}
            </div>
          </div>
          <div className="pt-4">
             <Button size="lg" className="w-full">Respond to this Request</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestDetailsPage;