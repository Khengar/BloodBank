import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Building2, Home, LogIn, LogOut, UserCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // 1. Import the useAuth hook

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. Get the current user and logout function

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  // Define navigation items with the roles that can see them
  const navItems = [
    { path: "/", label: "Home", icon: Home, roles: ["guest", "patient", "donor", "admin"] },
    { path: "/patient", label: "Patient Dashboard", icon: Heart, roles: ["patient"] },
    { path: "/donor", label: "Donor Dashboard", icon: Users, roles: ["donor"] },
    { path: "/blood-bank", label: "Find Banks", icon: Building2, roles: ["guest", "patient", "donor", "admin"] },
    { path: "/admin", label: "Admin Panel", icon: Shield, roles: ["admin"] }
  ];

  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              BloodLink
            </span>
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* 3. Role-Based Navigation Links */}
            {navItems.map((item) => {
              const userRole = user ? user.role : "guest";
              if (!item.roles.includes(userRole)) return null; // Hide link if user's role is not allowed
              
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button key={item.path} variant={isActive ? "default" : "ghost"} size="sm" asChild>
                  <Link to={item.path} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}

            {/* 4. Conditional Auth Buttons */}
            {user ? (
              // If user is logged in, show their name and a Logout button
              <>
                <Button variant="ghost" size="sm" className="pointer-events-none">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              // If user is a guest, show the Login/Sign Up button
              <Button size="sm" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;