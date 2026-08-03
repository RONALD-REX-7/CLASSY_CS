import { Logo } from "@/components/logo";
import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import React, { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const Calculator = lazy(() => import("./pages/Calculator.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

/** Branded fallback shown while a route chunk is being fetched. */
function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
        <Logo size={44} className="animate-floaty" />
        <div className="glass-inset h-1 w-40 overflow-hidden rounded-full">
          <div className="animate-shimmer h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(99,102,241,0.1),#6366f1,rgba(14,165,233,0.9),rgba(99,102,241,0.1))]" />
        </div>
      </div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 break-words text-xs text-muted-foreground">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 max-h-40 overflow-auto rounded border border-border/60 p-2 text-left text-[10px] leading-4 text-muted-foreground/80">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

/**
 * Route-aware scrolling:
 *  · navigations without a hash scroll to the top of the new page
 *  · navigations with a hash (e.g. /#scale) smooth-scroll to that section,
 *    so the "Features / Grade scale / How it works" links actually work.
 * The landing page is lazy-loaded, so scroll attempts are retried a few
 * times to wait for the section to be mounted.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const timers: number[] = [];
    const tryScroll = () => {
      if (!id) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    tryScroll();
    [150, 450, 900].forEach((delay) =>
      timers.push(window.setTimeout(tryScroll, delay)),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname, hash]);

  return null;
}

// Offline support (production builds only): cache the app shell. Wrapped in
// try/catch so sandboxed preview iframes never log errors.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline caching unavailable — the app still works online */
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      {/* CLASSY_CS theme — light glassmorphism by default, persisted to localStorage */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="classycs-theme"
      >
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <RouteSyncer />
            <ScrollManager />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route
                  path="/auth"
                  element={<AuthPage redirectAfterAuth="/calculator" />}
                />
                {/* Legacy protected dashboard → the calculator (frontend-only product) */}
                <Route path="/dashboard" element={<Navigate to="/calculator" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
