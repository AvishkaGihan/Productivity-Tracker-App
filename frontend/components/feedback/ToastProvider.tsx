import React, { createContext, useCallback, useContext, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import { useTheme } from "../../theme/ThemeContext";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: Toast["type"],
    action?: Toast["action"],
    duration?: number
  ) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type: Toast["type"] = "info",
      action?: Toast["action"],
      duration: number = 4000
    ) => {
      const id = Date.now().toString();
      setToast({ id, message, type, action, duration });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "success", undefined, duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "error", undefined, duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "info", undefined, duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, "warning", undefined, duration);
    },
    [showToast]
  );

  const hideToast = () => {
    setToast(null);
  };

  const getBackgroundColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.accent;
      case "info":
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <Snackbar
        visible={!!toast}
        onDismiss={hideToast}
        duration={toast?.duration || 4000}
        action={
          toast?.action
            ? {
                label: toast.action.label,
                onPress: () => {
                  toast.action?.onPress();
                  hideToast();
                },
              }
            : undefined
        }
        style={[
          styles.snackbar,
          {
            backgroundColor: toast ? getBackgroundColor(toast.type) : undefined,
          },
        ]}
        wrapperStyle={styles.wrapper}
      >
        {toast?.message}
      </Snackbar>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    bottom: Platform.OS === "ios" ? 90 : 70,
  },
  snackbar: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
});
