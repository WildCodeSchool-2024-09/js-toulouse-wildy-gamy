import { createContext, useContext, useState } from "react";

type User = {
  id: number;
  email: string;
  username?: string;
  name?: string;
  firstname?: string;
  is_admin: number;
  profile_pic?: string;
  current_points?: number;
  total_points?: number;
  highscore?: number;
  is_banned?: number;
  phone_number?: string | null;
};

export interface AuthContextType {
  user: User | null;

  auth: {
    token: string | null;
    user: User;
  } | null;

  login: (userData: User) => void;

  logout: () => void;

  setAuth: (data: { user: User } | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erreur de récupération de l'utilisateur:", error);
      return null;
    }
  });

  const setAuth = (data: { user: User } | null) => {
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setAuth,
        auth: user ? { token: null, user } : null,
        login: (userData: User) => setAuth({ user: userData }),
        logout: () => setAuth(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
}
