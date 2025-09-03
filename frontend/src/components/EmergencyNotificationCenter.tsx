import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Siren, AlertTriangle, Heart, Phone, Clock, MapPin, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyNotification {
  id: string;
  type: "critical" | "urgent" | "info";
  title: string;
  message: string;
  timestamp: Date;
  actionRequired: boolean;
  patientInfo?: {
    bloodGroup: string;
    rhFactor: string;
    hospitalName: string;
    contactNumber: string;
  };
}

const EmergencyNotificationCenter = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<EmergencyNotification[]>([
    {
      id: "notif-001",
      type: "critical",
      title: "🚨 CRITICAL BLOOD EMERGENCY",
      message: "O- blood urgently needed at AIIMS Emergency. Patient in critical condition.",
      timestamp: new Date(),
      actionRequired: true,
      patientInfo: {
        bloodGroup: "O",
        rhFactor: "negative",
        hospitalName: "AIIMS Emergency Ward",
        contactNumber: "+91-11-26588663"
      }
    },
    {
      id: "notif-002", 
      type: "urgent",
      title: "Urgent Blood Request",
      message: "AB+ blood needed at Max Hospital within 2 hours for emergency surgery.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      actionRequired: true,
      patientInfo: {
        bloodGroup: "AB",
        rhFactor: "positive",
        hospitalName: "Max Hospital Saket",
        contactNumber: "+91-11-26925801"
      }
    },
    {
      id: "notif-003",
      type: "info",
      title: "Blood Donation Camp",
      message: "Voluntary blood donation camp tomorrow at Red Cross Blood Bank, 9 AM to 5 PM.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionRequired: false
    }
  ]);

  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<EmergencyNotification | null>(null);

  // Auto-show critical notifications
  useEffect(() => {
    const criticalNotifications = notifications.filter(n => n.type === "critical");
    if (criticalNotifications.length > 0) {
      const latest = criticalNotifications[0];
      setSelectedNotification(latest);
      setShowEmergencyDialog(true);
      
      // Play notification sound (in a real app)
      // new Audio('/emergency-alert.mp3').play();
    }
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical": return <Siren className="h-5 w-5 text-medical-red animate-spin" />;
      case "urgent": return <AlertTriangle className="h-5 w-5 text-medical-orange" />;
      default: return <Heart className="h-5 w-5 text-medical-blue" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "critical": return "border-medical-red bg-medical-red-light animate-emergency-pulse";
      case "urgent": return "border-medical-orange bg-medical-orange-light";
      default: return "border-medical-blue bg-medical-blue-light";
    }
  };

  const handleEmergencyResponse = (notification: EmergencyNotification) => {
    if (notification.patientInfo) {
      toast({
        title: "Emergency Response Initiated",
        description: "Hospital has been notified of your availability",
        variant: "default"
      });
    }
    setShowEmergencyDialog(false);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Siren className="h-5 w-5 text-medical-red" />
            <span>Emergency Notifications</span>
            <Badge variant="destructive" className="animate-urgent-flash">
              {notifications.filter(n => n.type === "critical").length} CRITICAL
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time emergency alerts and blood requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications at the moment</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Alert 
                key={notification.id} 
                className={`${getNotificationStyle(notification.type)} transition-all duration-300 hover:shadow-medical`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <AlertTitle className="font-bold">{notification.title}</AlertTitle>
                      <AlertDescription className="mt-1">{notification.message}</AlertDescription>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{notification.timestamp.toLocaleTimeString()}</span>
                        </div>
                        {notification.patientInfo && (
                          <>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{notification.patientInfo.hospitalName}</span>
                            </div>
                            <Badge variant="outline" className="text-medical-red border-medical-red text-xs">
                              {notification.patientInfo.bloodGroup}{notification.patientInfo.rhFactor === "positive" ? "+" : "-"}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {notification.actionRequired && notification.patientInfo && (
                      <Button 
                        size="sm"
                        variant={notification.type === "critical" ? "emergency" : "medical"}
                        onClick={() => {
                          setSelectedNotification(notification);
                          setShowEmergencyDialog(true);
                        }}
                        className="animate-scale-in"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Respond
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => dismissNotification(notification.id)}
                      className="text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Emergency Response Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md border-medical-red animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-medical-red">
              <Siren className="h-5 w-5 animate-spin" />
              <span>🚨 Emergency Response Required</span>
            </DialogTitle>
            <DialogDescription>
              A patient urgently needs your blood type
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification?.patientInfo && (
            <div className="space-y-4">
              <Alert className="border-medical-red bg-medical-red-light">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Patient Information</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <div>Blood Type: <strong>{selectedNotification.patientInfo.bloodGroup}{selectedNotification.patientInfo.rhFactor === "positive" ? "+" : "-"}</strong></div>
                    <div>Hospital: <strong>{selectedNotification.patientInfo.hospitalName}</strong></div>
                    <div>Contact: <strong>{selectedNotification.patientInfo.contactNumber}</strong></div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">⚡ Time is critical - every minute counts!</p>
                <p>• If you can donate, respond immediately</p>
                <p>• Hospital will contact you for confirmation</p>
                <p>• Please ensure you're eligible to donate</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)} className="flex-1">
              Not Available
            </Button>
            <Button 
              onClick={() => handleEmergencyResponse(selectedNotification!)}
              className="flex-1 shadow-emergency" 
              variant="emergency"
            >
              <Zap className="mr-2 h-4 w-4" />
              I Can Help!
            </Button>
            {selectedNotification?.patientInfo && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={`tel:${selectedNotification.patientInfo.contactNumber}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Hospital
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyNotificationCenter;