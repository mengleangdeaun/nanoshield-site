"use client";

import { useId, type ReactNode } from "react";

/** Native popover menu; the only client JS is closing it after a link is tapped. */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  // Unique per instance: Cache Components keeps the previous route's header mounted (hidden),
  // so a fixed id would make the button open the wrong page's menu.
  const id = useId();
  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        className="inline-flex min-h-11 items-center border border-muted px-3 font-display text-[15px] tracking-[0.12em] uppercase text-fg hover:border-orange hover:text-orange min-[861px]:hidden"
      >
        {label}
      </button>
      <div
        id={id}
        data-mobile-menu
        popover="auto"
        onClick={(e) => {
          if ((e.target as Element).closest("a")) e.currentTarget.hidePopover();
        }}
        className="inset-x-0 top-[89px] bottom-auto m-0 h-auto w-full max-w-none border-0 border-b border-line bg-surface p-4 text-fg"
      >
        {children}
      </div>
    </>
  );
}
