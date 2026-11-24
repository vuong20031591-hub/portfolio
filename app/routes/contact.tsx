import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, CheckCircle2, Copy, Loader2, Send } from "lucide-react";
import { SiFacebook, SiGithub, SiTelegram } from "react-icons/si";
import type { Route } from "./+types/contact";
import styles from "./contact.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { CurvedDivider } from "~/components/ui/curved-divider";
import { SiteFooter } from "~/components/site-footer";
import { BackToTop } from "~/components/back-to-top";
import { useLanguage } from "~/contexts/language";
import { useContactForm } from "~/hooks/use-contact-form";

const CONTACT_EMAIL = "vuong20032604@gmail.com";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact - VuongTech" },
    {
      name: "description",
      content: "Get in touch with me for collaborations and opportunities",
    },
  ];
}

export default function Contact() {
  const { t, language } = useLanguage();
  const { formData, status, errorMessage, handleChange, handleSubmit, resetForm } =
    useContactForm("contact");
  const [copied, setCopied] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isLoading = status === "loading";
  const isVi = language === "vi";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: ignore clipboard permission errors
    }
  };

  const socials = [
    {
      name: t.contact.facebook,
      hint: t.contact.facebookValue,
      href: "https://www.facebook.com/nguyentienvuong2604",
      icon: <SiFacebook size={16} />,
      brandColor: "#1877F2",
    },
    {
      name: t.contact.telegram,
      hint: "@NguyenVug23",
      href: "https://t.me/NguyenVug23",
      icon: <SiTelegram size={16} />,
      brandColor: "#26A5E4",
    },
    {
      name: t.contact.github,
      hint: t.contact.githubValue,
      href: "https://github.com/nguyentienvuong2604",
      icon: <SiGithub size={16} />,
      brandColor: "currentColor",
    },
  ];

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.wrap}>
          {/* Editorial Header */}
          <header className={styles.hero}>
            <div className={styles.titleMask}>
              <motion.h1
                className={styles.title}
                initial={prefersReducedMotion ? false : { y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                {t.contact.heroTitle}
              </motion.h1>
            </div>
            <motion.p
              className={styles.subtitle}
              initial={prefersReducedMotion ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            >
              {t.contact.heroSubtitle}
            </motion.p>
          </header>

          {/* Main 2-Column Split: Editorial Form (left) + Direct Details (right) */}
          <section className={styles.grid}>
            {/* Left: Numbered Editorial Form */}
            <motion.div
              className={styles.formColumn}
              initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.16, ease: EASE_OUT }}
            >
              {status === "success" ? (
                <div className={styles.successState} role="status" aria-live="polite">
                  <CheckCircle2 size={36} strokeWidth={1.6} className={styles.successIcon} />
                  <h2 className={styles.successTitle}>
                    {isVi ? "Tin nhắn đã được gửi" : "Message sent"}
                  </h2>
                  <p className={styles.successText}>{t.contact.successMessage}</p>
                  <button type="button" onClick={resetForm} className={styles.resetButton}>
                    {isVi ? "Gửi tin nhắn khác" : "Send another message"}
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldNumber} aria-hidden="true">
                      01
                    </span>
                    <div className={styles.fieldBody}>
                      <label htmlFor="name" className={styles.label}>
                        {t.contact.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        required
                        autoComplete="name"
                        placeholder={t.contact.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <span className={styles.fieldNumber} aria-hidden="true">
                      02
                    </span>
                    <div className={styles.fieldBody}>
                      <label htmlFor="email" className={styles.label}>
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        required
                        autoComplete="email"
                        placeholder={t.contact.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <span className={styles.fieldNumber} aria-hidden="true">
                      03
                    </span>
                    <div className={styles.fieldBody}>
                      <label htmlFor="message" className={styles.label}>
                        {t.contact.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        required
                        rows={5}
                        placeholder={t.contact.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {status === "error" && errorMessage && (
                    <p className={styles.errorText} role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <div className={styles.submitRow}>
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className={styles.spinner} />
                          <span>{t.common.loading}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.contact.send}</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                    <span className={styles.responseNote}>{t.contact.formSubtitle}</span>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Right: Direct Contact Details & Social Directory */}
            <motion.aside
              className={styles.detailsColumn}
              initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT }}
            >
              {/* Person Identity */}
              <div className={styles.personRow}>
                <img
                  src="/images/avatar.webp"
                  alt="Nguyễn Tiến Vương"
                  className={styles.avatar}
                  decoding="async"
                />
                <div className={styles.personInfo}>
                  <span className={styles.personName}>Nguyễn Tiến Vương</span>
                  <span className={styles.personRole}>
                    {t.hero.rolePrimary} · {t.hero.roleSecondary}
                  </span>
                </div>
              </div>

              {/* Direct Email & Location */}
              <div className={styles.detailGroup}>
                <h2 className={styles.groupHeading}>
                  {isVi ? "Thông tin trực tiếp" : "Contact details"}
                </h2>

                <div className={styles.emailBlock}>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={styles.emailLink}>
                    {CONTACT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={styles.copyBtn}
                    aria-label={isVi ? "Sao chép email" : "Copy email address"}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? (isVi ? "Đã chép" : "Copied") : isVi ? "Sao chép" : "Copy"}</span>
                  </button>
                </div>

                <p className={styles.locationText}>
                  {t.hero.locationLabel}: {t.hero.locationValue} (GMT+7)
                </p>
              </div>

              {/* Social Links */}
              <div className={styles.detailGroup}>
                <h2 className={styles.groupHeading}>
                  {isVi ? "Mạng xã hội" : "Socials"}
                </h2>

                <ul className={styles.socialList}>
                  {socials.map((item) => (
                    <li key={item.name} className={styles.socialItem}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <span
                          className={styles.socialIcon}
                          style={{ color: item.brandColor }}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                        <span className={styles.socialText}>
                          <span className={styles.socialName}>{item.name}</span>
                          <span className={styles.socialHint}>{item.hint}</span>
                        </span>
                        <ArrowUpRight size={16} className={styles.socialArrow} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </section>
        </div>
      </main>

      {/* Closing Band — Curved Divider + Footer */}
      <div className={styles.closingBand}>
        <CurvedDivider
          topColor="var(--color-neutral-1)"
          bottomColor="var(--closing-bg)"
          maxHeight={160}
        />
        <div className={styles.closingInner}>
          <SiteFooter />
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
