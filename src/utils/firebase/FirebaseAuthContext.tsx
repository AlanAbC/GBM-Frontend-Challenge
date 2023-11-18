import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./index";
import queryKeys from "../queryKeys";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>({});

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    const user = localStorage.getItem(queryKeys.USER);
    if (!user) {
      router.replace("/login");
    }
    setUser(user);
  }, [router]);

  // Set up a listener for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.email);
        setLoading(false);
      } else {
        setUser(null);
        localStorage.clear();
        router.replace("/login");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    localStorage.clear();
    await signOut(auth);
  };
  // Provide the authentication context value to its consumers
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
