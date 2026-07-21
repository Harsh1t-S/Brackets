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
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  /** Re-fetch the current user (after a profile update). */
  refresh: () => Promise<void>;
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

  // Start "loading" only when a token exists. A signed-out visitor then
  // renders the real signed-out UI immediately, and a signed-in one shows
  // a placeholder instead of flashing Login/Register before /auth/me lands.
  const [loading, setLoading] = useState(
    () => !!localStorage.getItem("token")
  );

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
    // Bootstrap the session once on mount; loadUser updates state async.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        refresh: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}