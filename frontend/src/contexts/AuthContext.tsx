import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../lib/api'; // We'll create this API client next

// 1. DEFINE THE TYPES
// This interface should match the User model from your backend
interface User {
  _id: string;
  name: string;
  email: string;
  bloodType: string;
  phone?: string;
  location?: string;
  role: 'donor' | 'patient' | 'admin';
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean; // To handle initial page load state
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

// 2. CREATE THE CONTEXT
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. CREATE THE PROVIDER COMPONENT
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect runs when the app starts to check if a token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        // Set the token for all future API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Fetch user data to verify the token is still valid
          const { data } = await api.get('/users/me');
          setUser(data);
        } catch (error) {
          console.error("Token is invalid or expired. Logging out.", error);
          logout(); // Clear the invalid token
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // --- Core Authentication Functions ---
  const login = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
  };
  
  const register = async (userData: any) => {
    await api.post('/auth/register', userData);
    // After registration, the user typically has to log in separately
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. CREATE THE CUSTOM HOOK for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};