import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[460px] flex-col justify-center">
        <Link
          to="/"
          className="relative -mb-2 flex items-center justify-center leading-none"
        >
          <img
            src="/images/logo/logo.png"
            alt="Expenzoir"
            className="block h-28 w-auto object-contain sm:h-32"
          />
        </Link>

        {subtitle && (
          <p className="mb-4 text-center text-md text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}

        {children}

        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
