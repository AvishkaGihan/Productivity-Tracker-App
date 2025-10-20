import { useCallback, useEffect, useState } from "react";
import { useTaskStore } from "../store/task-store";

export const useTasks = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    tasks,
    stats,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskStore();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchTasks(), fetchStats()]);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  return {
    tasks,
    stats,
    isRefreshing,
    onRefresh,
    createTask,
    updateTask,
    deleteTask,
  };
};
