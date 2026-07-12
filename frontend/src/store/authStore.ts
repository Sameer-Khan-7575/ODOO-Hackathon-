import { create } from "zustand";
import client from "../api/client";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  department_id: number;
  departmentName?: string;
  xp?: number;
  points?: number;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("token"),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await client.post("/auth/login", { email, password });
      // Backend returns { token, user }
      const user: User = data.user;
      const token: string = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const { data } = await client.post("/auth/register", payload);
      const user: User = data.user;
      const token: string = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  setUser: (user: User) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
}));
