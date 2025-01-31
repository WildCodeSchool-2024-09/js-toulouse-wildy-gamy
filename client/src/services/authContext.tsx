import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

type User = {
  id: number;
  email: string;
  username: string;
  name: string;
  firstname: string;
  profile_pic?: string;
  phone_number?: string;
  is_banned: boolean;
  is_admin: boolean;
  total_points: number;
  current_points: number;
};

type Auth = {
  user: User;
  token: string;
} | null;

type AuthContextType = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/user");
        if (response && response.status === 200) {
          const data = await response.json();
          setAuth({ user: data, token: data.token });
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.logout();
      setAuth(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
