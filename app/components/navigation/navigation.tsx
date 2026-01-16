import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { Menu, X } from "lucide-react";
import styles from "./navigation.module.css";
import { useLanguage } from "~/contexts/language";
import { LanguageSwitcher } from "~/components/language-switcher";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle";
import { Button } from "~/components/ui/button/button";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className={styles.skipLink}>
        {t.nav?.skipToContent || "Skip to main content"}
      </a>
      
      <header className={styles.header}>
        <nav 
          className={styles.nav}
          aria-label={t.nav?.ariaLabel || "Main navigation"}
        >
          <div className={classNames(styles.navWrapper, { [styles.navWrapperScrolled]: scrolled })}>
            <div className={styles.navContainer}>
              <NavLink to="/" className={styles.logo} aria-label={t.nav?.homeAriaLabel || "Go to homepage"}>
                VuongTech
              </NavLink>
              <ul className={styles.navLinks} role="list">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) => classNames(styles.navLink, { [styles.navLinkActive]: isActive })}
                  >
                    {t.nav.home}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => classNames(styles.navLink, { [styles.navLinkActive]: isActive })}
                  >
                    {t.nav.about}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/projects"
                    className={({ isActive }) => classNames(styles.navLink, { [styles.navLinkActive]: isActive })}
                  >
                    {t.nav.projects}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => classNames(styles.navLink, { [styles.navLinkActive]: isActive })}
                  >
                    {t.nav.contact}
                  </NavLink>
                </li>
              </ul>
              <div className={styles.navActions}>
                {/* Desktop only */}
                <div className={styles.desktopActions}>
                  <ColorSchemeToggle />
                  <LanguageSwitcher />
                </div>
                {/* Mobile hamburger button */}
                <Button
                  variant="outline"
                  size="icon"
                  className={styles.hamburger}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div 
        className={classNames(styles.mobileOverlay, { [styles.mobileOverlayOpen]: mobileMenuOpen })}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile menu */}
      <div 
        className={classNames(styles.mobileMenu, { [styles.mobileMenuOpen]: mobileMenuOpen })}
        aria-hidden={!mobileMenuOpen}
      >
        <ul className={styles.mobileNavLinks} role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => classNames(styles.mobileNavLink, { [styles.mobileNavLinkActive]: isActive })}
              onClick={closeMobileMenu}
            >
              {t.nav.home}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => classNames(styles.mobileNavLink, { [styles.mobileNavLinkActive]: isActive })}
              onClick={closeMobileMenu}
            >
              {t.nav.about}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) => classNames(styles.mobileNavLink, { [styles.mobileNavLinkActive]: isActive })}
              onClick={closeMobileMenu}
            >
              {t.nav.projects}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => classNames(styles.mobileNavLink, { [styles.mobileNavLinkActive]: isActive })}
              onClick={closeMobileMenu}
            >
              {t.nav.contact}
            </NavLink>
          </li>
        </ul>
        
        {/* Mobile actions */}
        <div className={styles.mobileActions}>
          <ColorSchemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
