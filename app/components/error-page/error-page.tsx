import { Link } from "react-router";
import { ArrowLeft, FolderGit2, Mail, RotateCw } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { useLanguage } from "~/contexts/language";
import styles from "./error-page.module.css";
import type { ErrorPageProps } from "./error-page.types";

export function ErrorPage({ variant }: ErrorPageProps) {
  const { t } = useLanguage();
  const copy = variant === "notFound" ? t.errors.notFound : t.errors.serverError;
  const code = variant === "notFound" ? "404" : "500";

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">
          {code}
        </span>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.text}>{copy.text}</p>

        <div className={styles.actions}>
          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.errors.backHome}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/projects">
              <FolderGit2 className="mr-2 h-4 w-4" />
              {t.errors.viewProjects}
            </Link>
          </Button>
          {variant === "serverError" ? (
            <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
              <RotateCw className="mr-2 h-4 w-4" />
              {t.errors.reload}
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                {t.errors.contact}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
