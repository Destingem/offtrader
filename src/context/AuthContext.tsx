"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { account, ID } from "@/lib/appwriteClient"; // Import account from appwriteClient

interface User {
  $id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<User | null>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async (): Promise<User | null> => {
    try {
      if (account) {
        // Check if account is initialized
        const currentUser = await account.get();
  
        if (currentUser) {
          const user: User = {
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
          };
          
          setUser(user);
          return user;
        }
      }
    } catch (error) {
      setUser(null);
      console.error("Failed to refresh user:", error);
    }
    return null; // Explicitně vracíme null, místo aby se funkce ukončila bez návratové hodnoty
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await refreshUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);