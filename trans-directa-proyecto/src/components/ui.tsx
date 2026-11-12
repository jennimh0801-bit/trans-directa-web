import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useMotion";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as: Tag = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  once?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ once });
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "is-in", className)}
      style={{ "--reveal-d": `${delay}ms`, "--reveal-y": `${y}px` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  tone = "dark",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  icon?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
        tone === "dark"
          ? "border-signal-500/25 bg-signal-500/10 text-signal-300"
          : "border-ink-900/10 bg-ink-900/[0.04] text-ink-700",
        className
      )}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2} />}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  icon,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  icon?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <Eyebrow tone={tone} icon={icon}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={90}>
        <h2
          className={cn(
            "max-w-3xl text-balance text-[2rem] font-bold leading-[1.08] sm:text-[2.6rem] lg:text-[3.1rem]",
            tone === "dark" ? "text-bone-50" : "text-ink-900"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={170}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-[1.02rem] leading-relaxed sm:text-[1.1rem]",
              tone === "dark" ? "text-mist-400" : "text-ink-700/75"
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark" | "outline";
  size?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  icon?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  icon,
  disabled,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "btn-sheen group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "lg" ? "px-7 py-4 text-[0.98rem]" : "px-5 py-3 text-[0.9rem]",
        variant === "primary" &&
          "bg-gradient-to-r from-signal-400 via-signal-500 to-signal-600 text-ink-950 shadow-[0_14px_38px_-14px_rgba(255,181,36,0.9)] hover:shadow-[0_20px_46px_-14px_rgba(255,181,36,1)]",
        variant === "dark" &&
          "bg-ink-900 text-bone-50 shadow-[0_14px_38px_-16px_rgba(5,8,11,0.9)] hover:bg-ink-800",
        variant === "ghost" &&
          "border border-mist-400/25 bg-white/[0.04] text-bone-100 backdrop-blur hover:border-signal-500/50 hover:bg-white/[0.09]",
        variant === "outline" &&
          "border border-ink-900/15 bg-transparent text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/[0.04]",
        className
      )}
    >
      {children}
      {icon && (
        <Icon
          name={icon}
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2}
        />
      )}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  id,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-mist-400"
      >
        {label}
        {hint && <span className="text-[0.68rem] font-medium normal-case tracking-normal text-mist-500">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-flare-400" role="alert">
          <Icon name="alert" className="h-3.5 w-3.5" strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-mist-400/20 bg-ink-900/60 px-4 py-3 text-[0.95rem] text-bone-50 placeholder:text-mist-500/70 outline-none transition-all duration-200 focus:border-signal-500/70 focus:bg-ink-900 focus:ring-2 focus:ring-signal-500/25";

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300",
        checked
          ? "border-signal-500/60 bg-signal-500/30"
          : "border-mist-400/25 bg-ink-800"
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-300",
          checked
            ? "left-[calc(100%-1.4rem)] bg-signal-500 shadow-[0_0_14px_rgba(255,181,36,0.8)]"
            : "left-1 bg-mist-500"
        )}
      />
    </button>
  );
}

export function RangeInput({
  value,
  min,
  max,
  step = 1,
  onChange,
  id,
  ariaLabel,
  light = false,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  id?: string;
  ariaLabel: string;
  light?: boolean;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ "--fill": `${fill}%` } as React.CSSProperties}
      className={cn("h-6", light && "on-light")}
    />
  );
}