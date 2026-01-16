import { useState, useCallback, useRef } from "react";

/**
 * Form data cho contact form
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Trạng thái submit form
 */
export type SubmitStatus = "idle" | "loading" | "success" | "error";

/**
 * Return type của useContactForm hook
 */
export interface UseContactFormReturn {
  formData: ContactFormData;
  status: SubmitStatus;
  errorMessage: string;
  handleChange: (field: keyof ContactFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  message: "",
};

// Rate limiting constants
const RATE_LIMIT_KEY_PREFIX = "contact_form_submit_";
const RATE_LIMIT_WINDOW = Number(import.meta.env.VITE_CONTACT_FORM_RATE_LIMIT_WINDOW) || 60000;
const MAX_SUBMISSIONS = Number(import.meta.env.VITE_CONTACT_FORM_MAX_SUBMISSIONS) || 3;

/**
 * Kiểm tra rate limit
 */
function checkRateLimit(formName: string): { allowed: boolean; remainingTime?: number } {
  if (typeof window === "undefined") return { allowed: true };

  const key = `${RATE_LIMIT_KEY_PREFIX}${formName}`;
  const now = Date.now();
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return { allowed: true };

    const submissions: number[] = JSON.parse(stored);
    // Lọc các submission trong time window
    const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);

    if (recentSubmissions.length >= MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestSubmission)) / 1000);
      return { allowed: false, remainingTime };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/**
 * Ghi nhận submission vào localStorage
 */
function recordSubmission(formName: string): void {
  if (typeof window === "undefined") return;

  const key = `${RATE_LIMIT_KEY_PREFIX}${formName}`;
  const now = Date.now();

  try {
    const stored = localStorage.getItem(key);
    const submissions: number[] = stored ? JSON.parse(stored) : [];
    
    // Thêm submission mới và lọc các submission cũ
    const recentSubmissions = [...submissions, now].filter(
      time => now - time < RATE_LIMIT_WINDOW
    );

    localStorage.setItem(key, JSON.stringify(recentSubmissions));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Hook quản lý contact form với Netlify Forms
 * @param formName - Tên form đăng ký với Netlify
 */
export function useContactForm(formName: string = "contact"): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setStatus("idle");
    setErrorMessage("");
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra rate limit
    const rateLimitCheck = checkRateLimit(formName);
    if (!rateLimitCheck.allowed) {
      setStatus("error");
      setErrorMessage(
        `Too many submissions. Please wait ${rateLimitCheck.remainingTime} seconds before trying again.`
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Get Web3Forms access key from environment
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      
      if (!accessKey) {
        throw new Error("Web3Forms access key not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to .env");
      }

      // Prepare form data for Web3Forms
      const formPayload = {
        access_key: accessKey,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: `New Contact Form Submission from ${formData.name}`,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formPayload),
      });

      const result = await response.json();

      if (result.success) {
        // Ghi nhận submission thành công
        recordSubmission(formName);
        
        setStatus("success");
        setFormData(INITIAL_FORM_DATA);
        
        // Auto reset về idle sau 5 giây
        submitTimeoutRef.current = setTimeout(() => {
          setStatus("idle");
        }, 5000);
      } else {
        throw new Error(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  }, [formData, formName]);

  return {
    formData,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
