import type { Route } from "./+types/contact";
import styles from "./contact.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { Mail, Send, User, MessageSquare, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { SiFacebook, SiTelegram, SiGithub } from "react-icons/si";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import { useContactForm } from "~/hooks/use-contact-form";

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
  const { t } = useLanguage();
  const { formData, status, handleChange, handleSubmit } = useContactForm("contact");
  const isLoading = status === "loading";

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.backgroundGradient}>
        <div className={styles.gradientOrb} />
        <div className={styles.gradientOrb} />
        <div className={styles.gradientOrb} />
      </div>

      <div className={styles.content}>
        <Navigation />

        {/* Hero Section */}
        <section className={styles.hero}>
          <ScrollReveal variant="fade-up" width="100%">
            <h1 className={styles.title}>{t.contact.heroTitle}</h1>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2} width="100%">
            <p className={styles.subtitle}>{t.contact.heroSubtitle}</p>
          </ScrollReveal>
        </section>

        {/* Bento Grid */}
        <section className={styles.bentoGrid}>
          {/* Left Column - Contact Methods */}
          <div className={styles.contactMethods}>
            <ScrollReveal variant="fade-up" delay={0.3} width="100%">
              <a 
                href="mailto:vuong20032604@gmail.com" 
                className={`${styles.glassCard} ${styles.emailCard}`}
              >
                <div className={styles.cardIcon}>
                  <Mail size={20} />
                </div>
                <span className={styles.cardLabel}>{t.contact.emailLabel}</span>
                <span className={styles.cardValue}>vuong20032604@gmail.com</span>
                <span className={styles.cardAction}>
                  {t.contact.sendEmail} <ArrowRight size={14} />
                </span>
              </a>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.4} width="100%">
              <div className={`${styles.glassCard} ${styles.socialWrapper}`}>
                <a
                  href="https://www.facebook.com/nguyentienvuong2604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialCard} ${styles.facebook}`}
                >
                  <div className={styles.socialIcon}>
                    <SiFacebook />
                  </div>
                  <span className={styles.socialLabel}>{t.contact.facebook}</span>
                  <span className={styles.socialHint}>{t.contact.facebookValue}</span>
                </a>

                <a
                  href="https://t.me/NguyenTienVuong23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialCard} ${styles.telegram}`}
                >
                  <div className={styles.socialIcon}>
                    <SiTelegram />
                  </div>
                  <span className={styles.socialLabel}>{t.contact.telegram}</span>
                  <span className={styles.socialHint}>{t.contact.telegramValue}</span>
                </a>

                <a
                  href="https://github.com/nguyentienvuong2604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialCard} ${styles.github}`}
                >
                  <div className={styles.socialIcon}>
                    <SiGithub />
                  </div>
                  <span className={styles.socialLabel}>{t.contact.github}</span>
                  <span className={styles.socialHint}>{t.contact.githubValue}</span>
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Form */}
          <ScrollReveal variant="fade-up" delay={0.5} width="100%" className={styles.formWrapper}>
            <div className={`${styles.glassCard} ${styles.formCard}`}>
              <div className={styles.formHeader}>
                <div>
                  <h2 className={styles.formTitle}>{t.contact.formTitle}</h2>
                  <p className={styles.formSubtitle}>{t.contact.formSubtitle}</p>
                </div>
              </div>

              {status === "success" ? (
                <div className={styles.successMessage}>
                  <CheckCircle className={styles.successIcon} />
                  <p>{t.contact.successMessage}</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>
                        <User size={12} className={styles.labelIcon} />
                        {t.contact.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        required
                        placeholder={t.contact.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>
                        <Mail size={12} className={styles.labelIcon} />
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        required
                        placeholder={t.contact.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="message" className={styles.label}>
                        <MessageSquare size={12} className={styles.labelIcon} />
                        {t.contact.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        required
                        placeholder={t.contact.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className={styles.spinner} />
                          {t.common.loading}
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          {t.contact.send}
                        </>
                      )}
                    </button>
                  </form>
              )}
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
