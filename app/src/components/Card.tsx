import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  refs,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  refs?: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-steel-100 bg-white shadow-card ${className}`}>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-steel-100 px-5 py-3.5">
        <h2 className="text-sm font-semibold tracking-tight text-steel-900">{title}</h2>
        {subtitle && <p className="text-xs text-steel-500">{subtitle}</p>}
        {refs && refs.length > 0 && (
          <span className="ml-auto flex flex-wrap gap-1">
            {refs.map((r) => (
              <span key={r} className="chip num">
                {r}
              </span>
            ))}
          </span>
        )}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-lg border border-steel-100 bg-steel-50 px-3 py-2 text-xs leading-relaxed text-steel-600">
      {children}
    </p>
  );
}
