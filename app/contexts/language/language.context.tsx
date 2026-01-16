import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Language, LanguageContextValue, Translations } from "./language.types";
import en from "~/locales/en.json";
import vi from "~/locales/vi.json";

const STORAGE_KEY = "preferred-language";
const DEFAULT_LANGUAGE: Language = "en";

const translations: Record<Language, Translations> = {
  en: en as Translations,
  vi: vi as Translations,
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Detects user's preferred language from browser settings
 */
function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("vi")) return "vi";
  return "en";
}

/**
 * Gets stored language preference from localStorage
 */
function getStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "vi") return stored;
  return null;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage }: LanguageProviderProps) {
  // QUAN TRỌNG: Luôn khởi tạo với DEFAULT để tránh hydration mismatch
  // Client sẽ update sau khi hydrate xong
  const [language, setLanguageState] = useState<Language>(
    defaultLanguage || DEFAULT_LANGUAGE
  );

  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect - chỉ chạy trên client SAU KHI hydrate xong
  useEffect(() => {
    const stored = getStoredLanguage();
    const detected = detectBrowserLanguage();
    const clientLanguage = stored || detected;
    
    // Chỉ update nếu khác với default để tránh re-render không cần thiết
    if (clientLanguage !== (defaultLanguage || DEFAULT_LANGUAGE)) {
      setLanguageState(clientLanguage);
    }
    setIsHydrated(true);
  }, [defaultLanguage]);

  // Update html lang attribute
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = language;
    }
  }, [language, isHydrated]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: translations[language],
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 * @throws Error if used outside LanguageProvider
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
