import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth-store";

export const useAuth = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      setIsReady(true);
    };

    initialize();
  }, []);

  return {
    isReady,
    isAuthenticated,
    user,
  };
};
