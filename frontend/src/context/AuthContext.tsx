import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for demonstration if backend is unreachable
    if (email === 'demo@templeverse.com' && password === 'password') {
      const mockUser: User = {
        id: 'demo-123',
        name: 'Demo Devotee',
        email: 'demo@templeverse.com',
        role: 'user'
      };
      localStorage.setItem('token', 'demo-token');
      setToken('demo-token');
      setUser(mockUser);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration for demonstration since backend is not running
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create a mock user based on input
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
        role: 'user'
      };

      localStorage.setItem('token', `mock-token-${Date.now()}`);
      setToken(`mock-token-${Date.now()}`);
      setUser(mockUser);

      console.log('Mock registration successful for:', email);
      return;
    } catch (err) {
      console.error("Mock registration error", err);
    }

    try {
      const response = await authAPI.register(name, email, password);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
