import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Siren, AlertTriangle, Heart, Clock, MapPin, Phone, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyBloodRequest = () => {
  const { toast } = useToast();
  const [isEmergency, setIsEmergency] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    rhFactor: "",
    unitsNeeded: "",
    hospitalName: "",
    hospitalAddress: "",
    contactNumber: "",
    emergencyType: "",
    additionalDetails: "",
    estimatedTime: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencySubmit = () => {
    if (!formData.patientName || !formData.bloodGroup || !formData.rhFactor || !formData.unitsNeeded) {
      toast({
        title: "Missing Critical Information",
        description: "Please fill in all required emergency fields",
        variant: "destructive"
      });
      return;
    }

    // Show emergency success with enhanced styling
    toast({
      title: "🚨 EMERGENCY REQUEST SENT",
      description: "All nearby donors and blood banks have been alerted immediately",
      variant: "default"
    });

    // Reset form
    setFormData({
      patientName: "",
      bloodGroup: "",
      rhFactor: "",
      unitsNeeded: "",
      hospitalName: "",
      hospitalAddress: "",
      contactNumber: "",
      emergencyType: "",
      additionalDetails: "",
      estimatedTime: ""
    });
    setIsEmergency(false);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Mode Toggle */}
      <Card className={`shadow-card transition-all duration-300 ${isEmergency ? 'border-medical-red shadow-emergency animate-emergency-pulse' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-medical-red" />
              <span>Blood Request</span>
            </CardTitle>
            <Button
              onClick={() => setIsEmergency(!isEmergency)}
              variant={isEmergency ? "emergency" : "outline"}
              className={`${isEmergency ? 'animate-urgent-flash' : ''}`}
            >
              {isEmergency ? (
                <>
                  <Siren className="mr-2 h-4 w-4 animate-spin" />
                  🚨 EMERGENCY MODE
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Switch to Emergency
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {isEmergency 
              ? "⚡ Emergency mode: Immediate alerts will be sent to all nearby donors and blood banks"
              : "Create a standard blood request for your needs"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emergency Alert */}
          {isEmergency && (
            <Alert className="border-medical-red bg-medical-red-light animate-fade-in">
              <Siren className="h-4 w-4 text-medical-red animate-spin" />
              <AlertTitle className="text-medical-red">🚨 EMERGENCY MODE ACTIVATED</AlertTitle>
              <AlertDescription className="text-medical-red">
                This request will be marked as CRITICAL and sent immediately to all compatible donors and blood banks within 10km radius.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName" className={isEmergency ? "text-medical-red font-bold" : ""}>
                Patient Name *
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
                placeholder="Enter patient name"
                className={isEmergency ? "border-medical-red focus:ring-medical-red" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className={isEmergency ? "text-medical-red font-bold" : ""}>
                Emergency Contact *
              </Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                placeholder="+91-XXXXXXXXXX"
                className={isEmergency ? "border-medical-red focus:ring-medical-red" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className={isEmergency ? "text-medical-red font-bold" : ""}>
                Blood Group *
              </Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                <SelectTrigger className={isEmergency ? "border-medical-red" : ""}>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="O">O</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rhFactor" className={isEmergency ? "text-medical-red font-bold" : ""}>
                Rh Factor *
              </Label>
              <Select value={formData.rhFactor} onValueChange={(value) => handleInputChange("rhFactor", value)}>
                <SelectTrigger className={isEmergency ? "border-medical-red" : ""}>
                  <SelectValue placeholder="Select Rh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive (+)</SelectItem>
                  <SelectItem value="negative">Negative (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitsNeeded" className={isEmergency ? "text-medical-red font-bold" : ""}>
                Units Needed *
              </Label>
              <Input
                id="unitsNeeded"
                type="number"
                min="1"
                value={formData.unitsNeeded}
                onChange={(e) => handleInputChange("unitsNeeded", e.target.value)}
                placeholder="1"
                className={isEmergency ? "border-medical-red focus:ring-medical-red" : ""}
              />
            </div>
          </div>

          {isEmergency && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyType" className="text-medical-red font-bold">
                  Emergency Type
                </Label>
                <Select value={formData.emergencyType} onValueChange={(value) => handleInputChange("emergencyType", value)}>
                  <SelectTrigger className="border-medical-red">
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Accident/Trauma</SelectItem>
                    <SelectItem value="surgery">Emergency Surgery</SelectItem>
                    <SelectItem value="hemorrhage">Severe Hemorrhage</SelectItem>
                    <SelectItem value="delivery">Emergency Delivery</SelectItem>
                    <SelectItem value="other">Other Critical Condition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="text-medical-red font-bold">
                  Critical Time Window
                </Label>
                <Select value={formData.estimatedTime} onValueChange={(value) => handleInputChange("estimatedTime", value)}>
                  <SelectTrigger className="border-medical-red">
                    <SelectValue placeholder="How urgent?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (Life-threatening)</SelectItem>
                    <SelectItem value="30min">Within 30 minutes</SelectItem>
                    <SelectItem value="1hour">Within 1 hour</SelectItem>
                    <SelectItem value="2hours">Within 2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                value={formData.hospitalName}
                onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                placeholder="Enter hospital name"
                className={isEmergency ? "border-medical-red focus:ring-medical-red" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Input
                id="hospitalAddress"
                value={formData.hospitalAddress}
                onChange={(e) => handleInputChange("hospitalAddress", e.target.value)}
                placeholder="Complete address with pincode"
                className={isEmergency ? "border-medical-red focus:ring-medical-red" : ""}
              />
            </div>
          </div>

          {isEmergency && (
            <div className="space-y-2">
              <Label htmlFor="additionalDetails" className="text-medical-red font-bold">
                Additional Critical Details
              </Label>
              <Textarea
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
                placeholder="Any additional information that might help donors respond faster..."
                rows={3}
                className="border-medical-red focus:ring-medical-red"
              />
            </div>
          )}

          <Button 
            onClick={handleEmergencySubmit}
            className={`w-full ${isEmergency ? 'shadow-emergency animate-emergency-pulse' : 'shadow-medical'}`}
            variant={isEmergency ? "emergency" : "medical"}
            size="lg"
          >
            {isEmergency ? (
              <>
                <Zap className="mr-2 h-5 w-5" />
                🚨 SEND EMERGENCY ALERT
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Submit Blood Request
              </>
            )}
          </Button>

          {isEmergency && (
            <div className="text-center text-sm text-medical-red">
              <p className="font-bold">⚡ Emergency requests are sent immediately to:</p>
              <p>• All compatible donors within 10km</p>
              <p>• All blood banks in your area</p>
              <p>• Emergency contact lists</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyBloodRequest;