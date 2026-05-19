import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (profile: ProfilePayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = `${API_BASE_URL}/auth`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/user`, {
            headers: { "x-auth-token": token },
          });
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    if (res.data.user) setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    if (res.data.user) setUser(res.data.user);
  };

  const updateProfile = async (profile: ProfilePayload) => {
    if (!token) throw new Error("Not authenticated");

    const res = await axios.put(`${API_URL}/profile`, profile, {
      headers: { "x-auth-token": token },
    });
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
