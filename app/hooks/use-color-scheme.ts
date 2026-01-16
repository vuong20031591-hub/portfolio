import { useEffect, useState } from "react";

export type ColorScheme = "light" | "dark" | "system";
export type ResolvedColorScheme = "light" | "dark";

interface UseColorSchemeReturn {
  configScheme: ColorScheme;
  resolvedScheme: ResolvedColorScheme;
  rootCssClass: string;
  setColorScheme: (scheme: ColorScheme) => void;
}

const STORAGE_KEY = "color-scheme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemScheme(): ResolvedColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function getStoredScheme(): ColorScheme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (e) {
    // localStorage might not be available
  }
  return "system";
}

function resolveScheme(configScheme: ColorScheme): ResolvedColorScheme {
  if (configScheme === "system") {
    return getSystemScheme();
  }
  return configScheme;
}

export function useColorScheme(): UseColorSchemeReturn {
  const [configScheme, setConfigScheme] = useState<ColorScheme>(() => getStoredScheme());
  const [resolvedScheme, setResolvedScheme] = useState<ResolvedColorScheme>(() =>
    resolveScheme(getStoredScheme())
  );

  // ⚡ Áp dụng theme ngay khi component mount (hydration)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.className = resolvedScheme;
      document.documentElement.style.colorScheme = resolvedScheme;
    }
  }, []); // Chỉ chạy 1 lần khi mount

  useEffect(() => {
    // Update resolved scheme when config changes
    const newResolvedScheme = resolveScheme(configScheme);
    setResolvedScheme(newResolvedScheme);

    // ⚡ Cập nhật DOM trực tiếp để theme thay đổi ngay lập tức
    if (typeof document !== "undefined") {
      document.documentElement.className = newResolvedScheme;
      document.documentElement.style.colorScheme = newResolvedScheme;
    }

    // Listen to system preference changes
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = () => {
      if (configScheme === "system") {
        const systemScheme = getSystemScheme();
        setResolvedScheme(systemScheme);
        // ⚡ Cập nhật DOM khi system preference thay đổi
        if (typeof document !== "undefined") {
          document.documentElement.className = systemScheme;
          document.documentElement.style.colorScheme = systemScheme;
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [configScheme]);

  const setColorScheme = (scheme: ColorScheme) => {
    setConfigScheme(scheme);
    try {
      localStorage.setItem(STORAGE_KEY, scheme);
    } catch (e) {
      // localStorage might not be available
    }
  };

  const rootCssClass = resolvedScheme;

  return {
    configScheme,
    resolvedScheme,
    rootCssClass,
    setColorScheme,
  };
}
