import { useEffect, useRef } from "react";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { useLanguage } from "~/contexts/language";

/**
 * Web3Forms free-tier hCaptcha sitekey
 * Ref: https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha
 */
const WEB3FORMS_HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
const HCAPTCHA_SCRIPT_ID = "hcaptcha-api-script";

interface HCaptchaInstance {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string;
      theme?: "light" | "dark";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaInstance;
    __hcaptchaOnLoadCallbacks?: Array<() => void>;
    onHCaptchaLoad?: () => void;
  }
}

interface HCaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
  resetKey?: number;
  className?: string;
}

export function HCaptchaWidget({
  onVerify,
  onExpire,
  resetKey = 0,
  className,
}: HCaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  const { resolvedScheme } = useColorScheme();
  const { language } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.hcaptcha) return;

      if (widgetIdRef.current !== null) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch {
          // Ignore if widget already removed
        }
        widgetIdRef.current = null;
      }

      containerRef.current.innerHTML = "";
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: WEB3FORMS_HCAPTCHA_SITEKEY,
        theme: resolvedScheme === "dark" ? "dark" : "light",
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current(),
        "error-callback": () => onExpireRef.current(),
      });
    };

    if (window.hcaptcha) {
      renderWidget();
    } else {
      window.__hcaptchaOnLoadCallbacks = window.__hcaptchaOnLoadCallbacks || [];
      window.__hcaptchaOnLoadCallbacks.push(renderWidget);

      window.onHCaptchaLoad = () => {
        const callbacks = window.__hcaptchaOnLoadCallbacks || [];
        window.__hcaptchaOnLoadCallbacks = [];
        callbacks.forEach((cb) => cb());
      };

      if (!document.getElementById(HCAPTCHA_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = HCAPTCHA_SCRIPT_ID;
        script.src = `https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=onHCaptchaLoad&hl=${language}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.hcaptcha) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [resolvedScheme, language]);

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current !== null && window.hcaptcha) {
      try {
        window.hcaptcha.reset(widgetIdRef.current);
      } catch {
        // Ignore reset errors
      }
    }
  }, [resetKey]);

  return <div ref={containerRef} className={className} />;
}
