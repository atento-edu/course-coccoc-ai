import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/crm";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] lg:text-[32px]">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: "green" | "amber" | "red" | "blue" | "zinc" | "orange";
}) {
  const tones: Record<string, string> = {
    green: "border-brand-line bg-brand-soft text-brand-deep",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    zinc: "border-line-2 bg-paper-2 text-ink-2",
    orange: "border-orange/25 bg-orange/10 text-orange",
  };
  return <span className={cn("badge", tone ? tones[tone] : "border-line-2 bg-paper-2 text-ink-2", className)}>{children}</span>;
}

export function Kpi({
  label,
  value,
  hint,
  href,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  accent?: "green" | "orange" | "ink";
}) {
  const body = (
    <div className="card h-full p-4 transition hover:border-line-2">
      <div className="kpi-label">{label}</div>
      <div className={cn("kpi-value", accent === "green" ? "text-brand-deep" : accent === "orange" ? "text-orange" : "text-ink")}>
        {value}
      </div>
      {hint ? <div className="mt-2 text-[12px] leading-relaxed text-muted">{hint}</div> : null}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className,
  pad = true,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-line-2 bg-paper-2/40 px-4 py-8 text-center text-[13px] text-muted">{children}</div>;
}

export function SeeAll({ href, children = "Xem tất cả" }: { href: string; children?: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-deep hover:underline">
      {children} <ArrowUpRight size={13} />
    </Link>
  );
}

export function Bar({ value, max, color = "#25AF50" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-paper-2">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
