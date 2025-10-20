/**
 * Theme Context & Provider
 * Manages theme state and provides theme switching functionality
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Theme, ThemeMode, ThemeVariant, themes } from "./theme";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  themeVariant: ThemeVariant;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeVariant: (variant: ThemeVariant) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = "@theme_mode";
const THEME_VARIANT_KEY = "@theme_variant";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [themeVariant, setThemeVariantState] =
    useState<ThemeVariant>("default");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preferences
  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
      const savedVariant = await AsyncStorage.getItem(THEME_VARIANT_KEY);

      if (savedMode) {
        setThemeModeState(savedMode as ThemeMode);
      } else {
        // Use system preference if no saved preference
        setThemeModeState((systemColorScheme as ThemeMode) || "dark");
      }

      if (savedVariant) {
        setThemeVariantState(savedVariant as ThemeVariant);
      }
    } catch (error) {
      console.error("Failed to load theme preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
    }
  };

  const setThemeVariant = async (variant: ThemeVariant) => {
    try {
      setThemeVariantState(variant);
      await AsyncStorage.setItem(THEME_VARIANT_KEY, variant);
    } catch (error) {
      console.error("Failed to save theme variant:", error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  };

  const theme = themes[themeMode][themeVariant];

  const value: ThemeContextType = {
    theme,
    themeMode,
    themeVariant,
    setThemeMode,
    setThemeVariant,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
