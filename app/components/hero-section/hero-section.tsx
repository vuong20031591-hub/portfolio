import { useEffect, useRef } from "react";
import classNames from "classnames";
import { ArrowDownRight, Globe } from "lucide-react";
import { useLanguage } from "~/contexts/language";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./hero-section.types";

const HERO_NAME = "Nguyễn Tiến Vương";

/**
 * HeroSection phong cách editorial tối giản (inspired by Dennis Snellenberg)
 * - Chân dung nền trong suốt cố định giữa khung, parallax nhẹ khi cuộn
 * - Location pill bên trái với biểu tượng quả địa cầu xoay
 * - Role block bên phải với mũi tên chéo
 * - Kinetic marquee tên cỡ lớn ở đáy, đổi chiều & tăng tốc theo hướng cuộn
 */
export function HeroSection({ id = "hero", className }: HeroSectionProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return;

    let rafId = 0;
    let lastTime = performance.now();
    let offsetPercent = 0;
    let direction = -1;
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      if (delta !== 0) {
        direction = delta > 0 ? -1 : 1;
        scrollBoost = Math.min(Math.abs(delta) * 0.35, 18);
      }

      // Parallax nhẹ cho chân dung khi hero còn trong viewport
      if (portraitRef.current && sectionRef.current) {
        const heroHeight = sectionRef.current.offsetHeight || window.innerHeight;
        if (currentY <= heroHeight) {
          const shift = currentY * 0.14;
          portraitRef.current.style.transform = `translate3d(-50%, ${shift.toFixed(1)}px, 0)`;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Giảm dần vận tốc cộng thêm từ scroll để chuyển động mượt
      scrollBoost *= Math.pow(0.05, dt);

      const baseSpeed = 3.2; // %/giây (một nửa track mất ~15.6s)
      offsetPercent += direction * (baseSpeed + scrollBoost) * dt;

      if (offsetPercent <= -50) {
        offsetPercent += 50;
      } else if (offsetPercent > 0) {
        offsetPercent -= 50;
      }

      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = `translate3d(${offsetPercent.toFixed(3)}%, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={classNames(styles.hero, className)}
      aria-label={`${HERO_NAME} — ${t.hero.roleSecondary}`}
    >
      {/* Subtle top/bottom gradient để giữ tương phản cho nav & marquee */}
      <div className={styles.backdropGlow} aria-hidden="true" />

      {/* Chân dung nền trong suốt ở chính giữa */}
      <div ref={portraitRef} className={styles.portraitWrap}>
        <img
          src="/images/hero-editorial.webp"
          alt={HERO_NAME}
          className={styles.portrait}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Location Pill - bên trái */}
      <div className={styles.locationPill}>
        <div className={styles.locationText}>
          <span>{t.hero.locationLabel}</span>
          <span>{t.hero.locationValue}</span>
        </div>
        <div className={styles.globeBadge} aria-hidden="true">
          <Globe className={styles.globeIcon} strokeWidth={1.5} />
        </div>
      </div>

      {/* Role Block - bên phải */}
      <div className={styles.roleBlock}>
        <ArrowDownRight className={styles.roleArrow} strokeWidth={1.5} aria-hidden="true" />
        <h1 className={styles.roleTitle}>
          <span>{t.hero.rolePrimary}</span>
          <span>{t.hero.roleSecondary}</span>
        </h1>
      </div>

      {/* Kinetic Infinite Name Marquee - dưới cùng */}
      <div className={styles.marquee} aria-hidden="true">
        <div ref={marqueeTrackRef} className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            <span className={styles.marqueeItem}>
              {HERO_NAME}
              <span className={styles.marqueeDash}>—</span>
            </span>
            <span className={styles.marqueeItem}>
              {HERO_NAME}
              <span className={styles.marqueeDash}>—</span>
            </span>
          </div>
          <div className={styles.marqueeGroup}>
            <span className={styles.marqueeItem}>
              {HERO_NAME}
              <span className={styles.marqueeDash}>—</span>
            </span>
            <span className={styles.marqueeItem}>
              {HERO_NAME}
              <span className={styles.marqueeDash}>—</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
