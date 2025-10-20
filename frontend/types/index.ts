export interface User {
  id: number;
  email: string;
  goals?: string;
  notes?: string;
  created_at: string;
}

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
  message?: string;
}

export interface SuggestedTask {
  title: string;
  reason?: string;
}

export interface AISuggestionResponse {
  success: boolean;
  suggestions: SuggestedTask[];
  message?: string;
  query_context?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ContextData {
  goals?: string;
  notes?: string;
}

export type NavigationRoutes = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Tasks: undefined;
  AI: undefined;
  Analytics: undefined;
  Context: undefined;
};
