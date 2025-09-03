import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- CORE APP & AUTH IMPORTS ---
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/Navbar"; // Make sure this path is correct

// --- PAGE IMPORTS ---
import Index from "./pages/Index";
import Patient from "./pages/Patient";
import Donor from "./pages/Donor";
import BloodBank from "./pages/BloodBank";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import AdminDashboard from "./pages/AdminDashboatd"; // Import the AdminDashboard page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* AuthProvider wraps everything to provide global auth state */}
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4">
            <Routes>
              {/* === PUBLIC ROUTES === */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* === PROTECTED ROUTES === */}
              <Route
                path="/patient"
                element={<ProtectedRoute><Patient /></ProtectedRoute>}
              />
              <Route
                path="/donor"
                element={<ProtectedRoute><Donor /></ProtectedRoute>}
              />
               <Route
                path="/requests/:id"
                element={<ProtectedRoute><RequestDetailsPage /></ProtectedRoute>}
              />
              <Route
                path="/blood-bank"
                element={<ProtectedRoute><BloodBank /></ProtectedRoute>}
              />
              
              {/* === ADMIN ROUTE === */}
              <Route
                path="/admin"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />

              {/* === CATCH-ALL NOT FOUND ROUTE === */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

