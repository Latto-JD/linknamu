"use client";

import { useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="다크 모드 전환"
      suppressHydrationWarning
      className="fixed right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-lg shadow-[0_6px_20px_-10px_rgba(120,72,40,0.4)] backdrop-blur-md transition duration-200 hover:bg-white/70 dark:border-white/10 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
