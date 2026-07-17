import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser } from "../services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  async function loadUser() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data =
        await getCurrentUser(token);

      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    loadUser();
  }

  function logout() {
  localStorage.removeItem("token");
  setUser(null);

  window.location.href = "/";
}

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}