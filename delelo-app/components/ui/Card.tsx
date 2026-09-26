import type { ReactNode } from "react";

/* Белая карточка — базовый строительный блок UI */
export default function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {title && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
