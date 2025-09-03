import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Phone, MapPin, Clock, Heart, Siren, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  rhFactor: "positive" | "negative";
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  contactNumber: string;
  timePosted: Date;
  estimatedTimeLeft: number; // in minutes
  criticality: "critical" | "severe" | "urgent";
  distance: number; // in km
}

const EmergencyAlert = () => {
  const { toast } = useToast();
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([
    {
      id: "em-001",
      patientName: "Rajesh Kumar",
      bloodGroup: "O",
      rhFactor: "negative",
      unitsNeeded: 3,
      hospitalName: "AIIMS Emergency",
      hospitalAddress: "AIIMS, Ansari Nagar, New Delhi",
      contactNumber: "+91-11-26588663",
      timePosted: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      estimatedTimeLeft: 45, // 45 minutes left
      criticality: "critical",
      distance: 2.3
    },
    {
      id: "em-002",
      patientName: "Priya Sharma", 
      bloodGroup: "AB",
      rhFactor: "positive",
      unitsNeeded: 2,
      hospitalName: "Max Hospital Emergency",
      hospitalAddress: "Max Healthcare, Saket, New Delhi",
      contactNumber: "+91-11-26925801",
      timePosted: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      estimatedTimeLeft: 90,
      criticality: "severe",
      distance: 4.7
    }
  ]);

  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    phone: "",
    availableNow: false,
    canReachIn: ""
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencyRequests(prev => 
        prev.map(req => ({
          ...req,
          estimatedTimeLeft: Math.max(0, req.estimatedTimeLeft - 1)
        })).filter(req => req.estimatedTimeLeft > 0)
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Show emergency notification
  useEffect(() => {
    const criticalRequests = emergencyRequests.filter(req => req.criticality === "critical");
    if (criticalRequests.length > 0) {
      toast({
        title: "🚨 CRITICAL BLOOD EMERGENCY",
        description: `${criticalRequests.length} critical patient(s) need immediate blood donation`,
        variant: "destructive",
      });
    }
  }, [emergencyRequests, toast]);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "critical": return "text-medical-red border-medical-red bg-medical-red-light";
      case "severe": return "text-medical-orange border-medical-orange bg-medical-orange-light";
      case "urgent": return "text-medical-blue border-medical-blue bg-medical-blue-light";
      default: return "text-muted-foreground";
    }
  };

  const getCriticalityIcon = (criticality: string) => {
    switch (criticality) {
      case "critical": return <Siren className="h-4 w-4" />;
      case "severe": return <AlertTriangle className="h-4 w-4" />;
      case "urgent": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleEmergencyResponse = (request: EmergencyRequest) => {
    setSelectedRequest(request);
    setShowEmergencyDialog(true);
  };

  const submitEmergencyResponse = () => {
    if (!donorInfo.name || !donorInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and phone number",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Emergency Response Sent!",
      description: `Hospital will contact you immediately at ${donorInfo.phone}`,
      variant: "default"
    });

    setShowEmergencyDialog(false);
    setDonorInfo({ name: "", phone: "", availableNow: false, canReachIn: "" });
    setSelectedRequest(null);
  };

  const getTimeColor = (timeLeft: number) => {
    if (timeLeft <= 30) return "text-medical-red";
    if (timeLeft <= 60) return "text-medical-orange";
    return "text-medical-blue";
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      {emergencyRequests.some(req => req.criticality === "critical") && (
        <Alert className="border-medical-red bg-medical-red-light animate-emergency-pulse">
          <Siren className="h-5 w-5 text-medical-red animate-spin" />
          <AlertTitle className="text-medical-red font-bold">🚨 CRITICAL BLOOD EMERGENCY</AlertTitle>
          <AlertDescription className="text-medical-red">
            Multiple patients need immediate blood donation. Your response can save lives!
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Requests */}
      <Card className="shadow-emergency border-medical-red">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-medical-red">
            <Siren className="h-6 w-6 animate-spin" />
            <span>🚨 Emergency Blood Requests</span>
            <Badge variant="destructive" className="animate-urgent-flash">
              LIVE
            </Badge>
          </CardTitle>
          <CardDescription>
            Critical patients who need immediate blood donation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No emergency requests at the moment</p>
            </div>
          ) : (
            emergencyRequests.map((request) => (
              <div 
                key={request.id} 
                className={`border-2 rounded-lg p-4 ${getCriticalityColor(request.criticality)} 
                  ${request.criticality === "critical" ? "animate-emergency-pulse" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getCriticalityIcon(request.criticality)}
                    <Badge variant="outline" className="text-medical-red border-medical-red font-bold">
                      {request.bloodGroup}{request.rhFactor === "positive" ? "+" : "-"}
                    </Badge>
                    <span className="font-bold text-lg">{request.unitsNeeded} UNITS NEEDED</span>
                  </div>
                  <Badge className={`${getCriticalityColor(request.criticality)} font-bold animate-scale-in`}>
                    {request.criticality.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{request.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{request.hospitalName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-mono">{request.contactNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={`font-bold ${getTimeColor(request.estimatedTimeLeft)}`}>
                        {request.estimatedTimeLeft} min left
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{request.distance} km away</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Posted {Math.floor((Date.now() - request.timePosted.getTime()) / (1000 * 60))} min ago
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleEmergencyResponse(request)}
                    className="flex-1 shadow-emergency animate-scale-in"
                    variant={request.criticality === "critical" ? "emergency" : "medical"}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    EMERGENCY RESPONSE
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`tel:${request.contactNumber}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Hospital
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Emergency Response Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md border-medical-red">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-medical-red">
              <Siren className="h-5 w-5" />
              <span>🚨 Emergency Response</span>
            </DialogTitle>
            <DialogDescription>
              Respond to {selectedRequest?.patientName}'s emergency blood request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <Alert className="border-medical-red bg-medical-red-light">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Information</AlertTitle>
                <AlertDescription>
                  Patient needs <strong>{selectedRequest.bloodGroup}{selectedRequest.rhFactor === "positive" ? "+" : "-"}</strong> blood
                  • <strong>{selectedRequest.unitsNeeded} units</strong> • 
                  <strong className={getTimeColor(selectedRequest.estimatedTimeLeft)}> {selectedRequest.estimatedTimeLeft} min left</strong>
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={donorInfo.phone}
                      onChange={(e) => setDonorInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reachTime">How soon can you reach the hospital?</Label>
                  <Input
                    id="reachTime"
                    value={donorInfo.canReachIn}
                    onChange={(e) => setDonorInfo(prev => ({ ...prev, canReachIn: e.target.value }))}
                    placeholder="e.g., 15 minutes, 30 minutes"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitEmergencyResponse} className="shadow-emergency" variant="emergency">
              <Zap className="mr-2 h-4 w-4" />
              Send Emergency Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyAlert;