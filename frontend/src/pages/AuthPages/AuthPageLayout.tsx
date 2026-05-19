import React from "react";
<<<<<<< HEAD
=======
import GridShape from "../../components/common/GridShape";
>>>>>>> 3c63753f807681cadcf3218491ef96754b0a5fb3
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
<<<<<<< HEAD
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
=======
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">

        {children}

        {/* RIGHT SIDE BRAND PANEL */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">

            <GridShape />

            <div className="flex flex-col items-center max-w-xs">

              {/* LOGO / BRAND */}
              <Link to="/" className="block mb-4">
                <h1 className="text-4xl font-bold tracking-tight text-white dark:text-gray-900">
                  Expenzoir
                </h1>
              </Link>

              {/* TAGLINE */}
              <p className="text-center text-gray-400 dark:text-white/60">
                Smart Expense Tracking & Financial Intelligence Platform
              </p>

            </div>
          </div>
        </div>

        {/* THEME TOGGLE */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>

      </div>
    </div>
  );
}
>>>>>>> 3c63753f807681cadcf3218491ef96754b0a5fb3
