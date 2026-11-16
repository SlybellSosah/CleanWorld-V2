import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";
import { ContactBar } from "./components/ContactBar";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { showingUnconfirmed } from "./content/company";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-white">
          Skip to content
        </a>
        {showingUnconfirmed && (
          <div role="region" aria-label="Preview notice" className="bg-sun px-4 py-2 text-center text-sm font-medium text-navy">
            Preview — showing details not yet confirmed by the owner
          </div>
        )}
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
        <ContactBar />
      </LazyMotion>
    </MotionConfig>
  );
}

export function HydrateFallback() {
  return <p className="wrap py-24 text-muted">Loading…</p>;
}
