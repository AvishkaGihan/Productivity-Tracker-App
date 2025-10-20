import { create } from "zustand";
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
