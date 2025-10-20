import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { authAPI } from "../services/api-client";

export interface User {
  id: number;
  email: string;
  goals?: string;
  notes?: string;
  created_at: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.register(email, password);
      const { access_token, user } = response.data;

      await AsyncStorage.setItem("access_token", access_token);
      set({
        isAuthenticated: true,
        user,
        token: access_token,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Registration failed";
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.login(email, password);
      const { access_token, user } = response.data;

      await AsyncStorage.setItem("access_token", access_token);
      set({
        isAuthenticated: true,
        user,
        token: access_token,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Login failed";
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      set({ isAuthenticated: false, user: null, token: null, error: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const response = await authAPI.getProfile();
        set({ isAuthenticated: true, user: response.data, token });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await AsyncStorage.removeItem("access_token");
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  setUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// store/task-store.ts
import { taskAPI } from "../services/api-client";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

interface TaskStore {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (statusFilter?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (title: string) => Promise<boolean>;
  updateTask: (
    taskId: number,
    title?: string,
    isCompleted?: boolean
  ) => Promise<boolean>;
  deleteTask: (taskId: number) => Promise<boolean>;
  setTasks: (tasks: Task[]) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchTasks: async (statusFilter?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await taskAPI.getAll(statusFilter);
      set({ tasks: response.data.tasks, isLoading: false });
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to fetch tasks";
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await taskAPI.getStats();
      set({ stats: response.data });
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  },

  createTask: async (title: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await taskAPI.create(title);
      set((state) => ({
        tasks: [response.data, ...state.tasks],
        isLoading: false,
      }));
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to create task";
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  updateTask: async (taskId: number, title?: string, isCompleted?: boolean) => {
    try {
      const response = await taskAPI.update(taskId, title, isCompleted);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
      }));
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to update task";
      set({ error: errorMsg });
      return false;
    }
  },

  deleteTask: async (taskId: number) => {
    try {
      await taskAPI.delete(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to delete task";
      set({ error: errorMsg });
      return false;
    }
  },

  setTasks: (tasks: Task[]) => {
    set({ tasks });
  },

  clearError: () => {
    set({ error: null });
  },
}));
