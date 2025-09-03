import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Building2, ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { sampleBloodRequests, sampleBloodBanks } from "@/data/sampleData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-medical rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                  BloodLink
                </h1>
                <p className="text-xs text-muted-foreground">Connecting lives through blood donation</p>
              </div>
            </div>
            <Badge variant="outline" className="text-medical-green border-medical-green">
              24/7 Emergency Service
            </Badge>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-medical-red-light">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-medical rounded-full mb-6 shadow-emergency">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Every Drop Counts, Every Life Matters
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect patients in urgent need with willing donors and trusted blood banks. 
              Join BloodLink today and help save lives in your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" variant="medical" className="text-lg px-8">
                <Link to="/patient">
                  <Heart className="mr-2" />
                  I Need Blood
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/donor">
                  <Users className="mr-2" />
                  I Want to Donate
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-medical-red">500+</div>
                <div className="text-sm text-muted-foreground">Lives Saved</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-medical-blue">150+</div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-medical-green">25+</div>
                <div className="text-sm text-muted-foreground">Partner Blood Banks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a patient in need, a willing donor, or a blood bank administrator, 
              BloodLink has the tools you need to save lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Patient Card */}
            <Card className="shadow-card hover:shadow-medical transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-red-light rounded-full mb-4 group-hover:bg-medical-red group-hover:shadow-medical transition-all duration-300">
                  <Heart className="h-8 w-8 text-medical-red group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl">Patient</CardTitle>
                <CardDescription>
                  Need blood urgently? Create a request and get matched with nearby donors and blood banks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Create urgent blood requests</li>
                  <li>• Get matched with compatible donors</li>
                  <li>• Track request status in real-time</li>
                  <li>• Connect with nearby blood banks</li>
                </ul>
                <Button asChild className="w-full" variant="medical">
                  <Link to="/patient">
                    Start Blood Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Donor Card */}
            <Card className="shadow-card hover:shadow-medical transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-blue-light rounded-full mb-4 group-hover:bg-medical-blue group-hover:shadow-medical transition-all duration-300">
                  <Users className="h-8 w-8 text-medical-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl">Donor</CardTitle>
                <CardDescription>
                  Be a hero! Register as a donor and help patients in your area who need blood.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Register with eligibility check</li>
                  <li>• Get notified of nearby requests</li>
                  <li>• Track your donation history</li>
                  <li>• Manage availability status</li>
                </ul>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/donor">
                    Become a Donor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blood Bank Card */}
            <Card className="shadow-card hover:shadow-medical transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-green-light rounded-full mb-4 group-hover:bg-medical-green group-hover:shadow-medical transition-all duration-300">
                  <Building2 className="h-8 w-8 text-medical-green group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl">Blood Bank</CardTitle>
                <CardDescription>
                  Manage your blood inventory and fulfill requests from patients in your area.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Manage blood inventory</li>
                  <li>• Process patient requests</li>
                  <li>• Track expiry dates</li>
                  <li>• Update availability status</li>
                </ul>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/blood-bank">
                    Manage Blood Bank
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Updates */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Live Blood Requests</h2>
            <p className="text-muted-foreground">
              See current blood requests from patients in need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sampleBloodRequests.slice(0, 3).map((request) => (
              <Card key={request.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-medical-red border-medical-red">
                      {request.bloodGroup}{request.rhFactor === "positive" ? "+" : "-"}
                    </Badge>
                    <Badge variant={request.urgency === "immediate" ? "destructive" : "secondary"}>
                      {request.urgency}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{request.unitsNeeded} units needed</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{request.hospitalName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{request.requestDate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/donor">
                View All Requests
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Blood Banks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Partner Blood Banks</h2>
            <p className="text-muted-foreground">
              Trusted blood banks in your area with 24/7 availability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sampleBloodBanks.map((bank) => (
              <Card key={bank.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 className="h-6 w-6 text-medical-green" />
                    <Badge variant="outline" className="text-medical-green border-medical-green">
                      {bank.operatingHours}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{bank.name}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{bank.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{bank.contactNumber}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bank.inventory.slice(0, 4).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item.bloodGroup}{item.rhFactor === "positive" ? "+" : "-"}: {item.unitsAvailable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                BloodLink
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Connecting lives through blood donation • Available 24/7 for emergencies
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>Emergency Helpline: 1800-123-BLOOD</span>
              <span>•</span>
              <span>Email: help@bloodlink.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
