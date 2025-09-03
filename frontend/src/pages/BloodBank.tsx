import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Package, Clock, CheckCircle, AlertTriangle, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleBloodRequests, sampleBloodBanks, BloodInventory } from "@/data/sampleData";
import Navbar from "@/components/Navbar";

const BloodBank = () => {
  const { toast } = useToast();
  const [selectedBank] = useState(sampleBloodBanks[0]); // Demo: Use first bank
  const [inventory, setInventory] = useState<BloodInventory[]>(selectedBank.inventory);
  const [newInventory, setNewInventory] = useState({
    bloodGroup: "",
    rhFactor: "",
    unitsToAdd: "",
    expiryDate: ""
  });

  const handleInventoryChange = (field: string, value: string) => {
    setNewInventory(prev => ({ ...prev, [field]: value }));
  };

  const addToInventory = () => {
    if (!newInventory.bloodGroup || !newInventory.rhFactor || !newInventory.unitsToAdd) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const units = parseInt(newInventory.unitsToAdd);
    const bloodType = `${newInventory.bloodGroup}${newInventory.rhFactor}`;
    
    setInventory(prev => {
      const existingIndex = prev.findIndex(
        item => item.bloodGroup === newInventory.bloodGroup && 
                item.rhFactor === newInventory.rhFactor
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          unitsAvailable: updated[existingIndex].unitsAvailable + units
        };
        return updated;
      } else {
        return [...prev, {
          bloodGroup: newInventory.bloodGroup,
          rhFactor: newInventory.rhFactor as "positive" | "negative",
          unitsAvailable: units,
          expiryDate: new Date(newInventory.expiryDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
        }];
      }
    });

    toast({
      title: "Inventory Updated",
      description: `Added ${units} units of ${bloodType} blood`,
      variant: "default"
    });

    setNewInventory({
      bloodGroup: "",
      rhFactor: "",
      unitsToAdd: "",
      expiryDate: ""
    });
  };

  const markRequestComplete = (requestId: string) => {
    toast({
      title: "Request Completed",
      description: "Blood request has been marked as fulfilled",
      variant: "default"
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "text-medical-orange";
      case "urgent":
        return "text-medical-red";
      case "scheduled":
        return "text-medical-blue";
      default:
        return "text-muted-foreground";
    }
  };

  const getExpiryWarning = (expiryDate: Date) => {
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7) return "urgent";
    if (daysUntilExpiry <= 14) return "warning";
    return "normal";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-green-light rounded-full mb-4">
            <Building2 className="h-8 w-8 text-medical-green" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Blood Bank Dashboard</h1>
          <p className="text-muted-foreground">Manage inventory and fulfill blood requests</p>
        </div>

        {/* Blood Bank Info */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-medical-green" />
              <span>{selectedBank.name}</span>
            </CardTitle>
            <CardDescription>
              {selectedBank.address} • {selectedBank.contactNumber} • {selectedBank.operatingHours}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Management */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-medical-blue" />
                  <span>Blood Inventory</span>
                </CardTitle>
                <CardDescription>
                  Current blood units available in your bank
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventory.map((item, index) => {
                    const expiryWarning = getExpiryWarning(item.expiryDate);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-medical-red border-medical-red">
                            {item.bloodGroup}{item.rhFactor === "positive" ? "+" : "-"}
                          </Badge>
                          <div>
                            <div className="font-medium">{item.unitsAvailable} units</div>
                            <div className={`text-xs ${
                              expiryWarning === "urgent" ? "text-medical-orange" :
                              expiryWarning === "warning" ? "text-medical-red" :
                              "text-muted-foreground"
                            }`}>
                              Expires: {item.expiryDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {expiryWarning === "urgent" && (
                          <AlertTriangle className="h-4 w-4 text-medical-orange" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-medical-green" />
                  <span>Add to Inventory</span>
                </CardTitle>
                <CardDescription>
                  Add new blood units to your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={newInventory.bloodGroup} onValueChange={(value) => handleInventoryChange("bloodGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
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
                    <Label htmlFor="rhFactor">Rh Factor</Label>
                    <Select value={newInventory.rhFactor} onValueChange={(value) => handleInventoryChange("rhFactor", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive (+)</SelectItem>
                        <SelectItem value="negative">Negative (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitsToAdd">Units to Add</Label>
                    <Input
                      id="unitsToAdd"
                      type="number"
                      min="1"
                      value={newInventory.unitsToAdd}
                      onChange={(e) => handleInventoryChange("unitsToAdd", e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newInventory.expiryDate}
                    onChange={(e) => handleInventoryChange("expiryDate", e.target.value)}
                  />
                </div>
                <Button onClick={addToInventory} className="w-full shadow-medical">
                  Add to Inventory
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Requests */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-medical-orange" />
                <span>Pending Blood Requests</span>
              </CardTitle>
              <CardDescription>
                Blood requests that need to be fulfilled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBloodRequests.filter(req => req.status === "pending").map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.patientName}</div>
                          <div className="text-sm text-muted-foreground">{request.hospitalName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-medical-red border-medical-red">
                          {request.bloodGroup}{request.rhFactor === "positive" ? "+" : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.unitsNeeded}</TableCell>
                      <TableCell>
                        <span className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => markRequestComplete(request.id)}
                          className="shadow-medical"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Fulfill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodBank;