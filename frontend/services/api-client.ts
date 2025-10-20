import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AsyncStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string) =>
    apiClient.post("/auth/register", { email, password }),
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),
  getProfile: () => apiClient.get("/auth/me"),
  logout: () => apiClient.post("/auth/logout"),
};

export const taskAPI = {
  create: (title: string) => apiClient.post("/tasks", { title }),
  getAll: (statusFilter?: string) =>
    apiClient.get("/tasks", { params: { status_filter: statusFilter } }),
  getById: (taskId: number) => apiClient.get(`/tasks/${taskId}`),
  update: (taskId: number, title?: string, isCompleted?: boolean) =>
    apiClient.put(`/tasks/${taskId}`, { title, is_completed: isCompleted }),
  delete: (taskId: number) => apiClient.delete(`/tasks/${taskId}`),
  getStats: () => apiClient.get("/tasks/stats/overview"),
};

export const aiAPI = {
  suggest: (query: string) => apiClient.post("/ai/suggest", { query }),
  suggestAndCreate: (query: string) =>
    apiClient.post("/ai/suggest-and-create", { query }),
  checkHealth: () => apiClient.get("/ai/health"),
  getExamples: () => apiClient.get("/ai/examples"),
};

export const contextAPI = {
  get: () => apiClient.get("/context"),
  update: (goals?: string, notes?: string) =>
    apiClient.put("/context", { goals, notes }),
  delete: () => apiClient.delete("/context"),
  getProfile: () => apiClient.get("/context/profile"),
  validate: (goals?: string, notes?: string) =>
    apiClient.post("/context/validate", { goals, notes }),
  getGuidelines: () => apiClient.get("/context/guidelines/best-practices"),
};

export default apiClient;
