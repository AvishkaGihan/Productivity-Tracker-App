import { AxiosError } from "axios";
import { useCallback, useState } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

export const useApi = <T>(apiCall: () => Promise<T>, immediate = true) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await apiCall();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const err = error as AxiosError;
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, [apiCall]);

  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { ...state, execute };
};
