import { X, Mail, User, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button/button";
import { useLanguage } from "~/contexts/language";
import { useContactForm } from "~/hooks/use-contact-form";
import styles from "./contact-modal.module.css";
import type { ContactModalProps } from "./contact-modal.types";

const FORM_NAME = "contact-modal";

/**
 * ContactModal - Modal form liên hệ với animation expand
 * Tích hợp Netlify Forms để gửi email
 */
export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useLanguage();
  const { formData, status, handleChange, handleSubmit, resetForm } = useContactForm(FORM_NAME);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.fullscreenOverlay} style={{ zIndex: 100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className={styles.backdrop}
          />
          <motion.div
            layoutId="contact-card"
            className={styles.expandedCard}
            style={{ width: "100%", height: "100%", borderRadius: 0 }}
          >
            <div className={styles.ctaBackground}>
              <div className={styles.ctaGradient} />
            </div>

            <button className={styles.closeButton} onClick={handleClose}>
              <X />
            </button>

            <motion.div className={styles.expandedContent}>
              <div className={styles.expandedHeader}>
                <h2 className={styles.expandedTitle}>{t.contact.title}</h2>
                <p className={styles.expandedSubtitle}>{t.contact.subtitle}</p>
              </div>

              {status === "success" ? (
                <SuccessMessage message={t.contact.successMessage} />
              ) : (
                <ContactForm
                  formData={formData}
                  status={status}
                  t={t}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Success message component
 */
function SuccessMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.successMessage}
    >
      <CheckCircle className={styles.successIcon} />
      <p>{message}</p>
    </motion.div>
  );
}

/**
 * Contact form component
 */
interface ContactFormProps {
  formData: { name: string; email: string; message: string };
  status: "idle" | "loading" | "success" | "error";
  t: ReturnType<typeof useLanguage>["t"];
  onChange: (field: "name" | "email" | "message", value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

function ContactForm({ formData, status, t, onChange, onSubmit }: ContactFormProps) {
  const isLoading = status === "loading";

  return (
    <>
      {/* Hidden form for Netlify detection */}
      <form name={FORM_NAME} data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message" />
      </form>

      <form className={styles.contactForm} onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value={FORM_NAME} />
        {/* Honeypot field - chống spam bot */}
        <input type="text" name="bot-field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{t.contact.name}</label>
          <div className={styles.inputWrapper}>
            <User className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              className={styles.formInput}
              placeholder={t.contact.namePlaceholder}
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{t.contact.email}</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              className={styles.formInput}
              placeholder={t.contact.emailPlaceholder}
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{t.contact.message}</label>
          <div className={styles.inputWrapper}>
            <MessageSquare className={styles.textareaIcon} />
            <textarea
              name="message"
              className={`${styles.formInput} ${styles.formTextarea}`}
              placeholder={t.contact.messagePlaceholder}
              value={formData.message}
              onChange={(e) => onChange("message", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <Button size="lg" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {t.common.loading}
            </>
          ) : (
            <>
              {t.contact.send} <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
