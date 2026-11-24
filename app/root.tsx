import React from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import { Toaster } from "./components/ui/toaster/toaster";

import "./styles/reset.css";
import "./styles/global.css";
import "./styles/tokens/keyframes.css";
import "./styles/tokens/animations.css";
import "./styles/tokens/colors.css";
import "./styles/tokens/decorations.css";
import "./styles/tokens/spacings.css";
import "./styles/tokens/typography.css";
import "./styles/theme.css";
import { useColorScheme } from "./hooks/use-color-scheme";
import { LanguageProvider } from "./contexts/language";
import { ErrorPage } from "./components/error-page";
import { Navigation } from "./components/navigation/navigation";
import { SiteFooter } from "./components/site-footer";
import { Spotlight } from "./components/spotlight";
import { getR2PublicUrl } from "./config/cdn";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Favicons
  { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Great+Vibes&display=swap",
  },
];

/**
 * Loader to inject R2 CDN URL into client-side
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Access Cloudflare Secrets via context.cloudflare.env
  const cloudflareContext = context as { cloudflare?: { env?: Record<string, unknown> } };
  const env = cloudflareContext.cloudflare?.env;
  
  return {
    r2PublicUrl: getR2PublicUrl(env),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { rootCssClass, resolvedScheme } = useColorScheme();
  return (
    <html lang="en" suppressHydrationWarning className={rootCssClass} style={{ colorScheme: resolvedScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  // Detect if running inside iframe
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      document.body.classList.add('in-iframe');
    }
  }, []);

  return (
    <LanguageProvider>
      {/* Inject R2 public URL for client-side CDN config */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__R2_PUBLIC_URL__ = ${JSON.stringify(loaderData?.r2PublicUrl || '')};`,
        }}
      />
      <Spotlight size={700} />
      <Outlet />
    </LanguageProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const stack = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return (
    <LanguageProvider>
      {isNotFound ? (
        <>
          <Navigation />
          <main>
            <ErrorPage variant="notFound" />
          </main>
          <SiteFooter />
        </>
      ) : (
        <ErrorPage variant="serverError" />
      )}
      {stack && (
        <pre
          style={{
            maxWidth: "900px",
            margin: "0 auto 48px",
            padding: "16px",
            overflow: "auto",
            fontSize: "12px",
            borderRadius: "8px",
            background: "var(--color-neutral-3)",
            color: "var(--color-neutral-11)",
          }}
        >
          <code>{stack}</code>
        </pre>
      )}
    </LanguageProvider>
  );
}
