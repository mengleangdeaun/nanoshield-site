"use client";

/**
 * Flips light/dark and remembers it. Which icon (and label) shows is pure CSS via the `light:`
 * variant, so server HTML never depends on the visitor's theme. The no-flash script in the root
 * layout re-applies the stored choice before first paint.
 */
export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light"; // no choice yet = dark default
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode): the theme still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-11 items-center justify-center text-muted hover:text-orange"
    >
      <span className="inline-flex light:hidden">
        {/* sun: shown in dark mode */}
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
        <span className="sr-only">{toLight}</span>
      </span>
      <span className="hidden light:inline-flex">
        {/* moon: shown in light mode */}
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
        <span className="sr-only">{toDark}</span>
      </span>
    </button>
  );
}
