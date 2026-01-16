import { useLanguage, type Language } from "~/contexts/language";
import { Button } from "~/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu";
import styles from "./language-switcher.module.css";

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

interface LanguageSwitcherProps {
  /** Show text label next to icon in trigger */
  showLabel?: boolean;
}

export function LanguageSwitcher({ showLabel = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="Switch language"
        >
          <span className={styles.currentFlag}>{currentLang.flag}</span>
          {showLabel && <span className={styles.currentCode}>{currentLang.code.toUpperCase()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={styles.option}
            data-selected={language === lang.code}
          >
            <span className={styles.flag}>{lang.flag}</span>
            <span className={styles.langLabel}>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
