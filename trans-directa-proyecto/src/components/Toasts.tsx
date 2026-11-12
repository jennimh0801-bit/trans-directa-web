import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";

const TONES = {
  mint: { bar: "bg-mint-400", text: "text-mint-400", icon: "check" },
  signal: { bar: "bg-signal-500", text: "text-signal-400", icon: "bolt" },
  cobalt: { bar: "bg-cobalt-400", text: "text-cobalt-300", icon: "download" },
  flare: { bar: "bg-flare-500", text: "text-flare-400", icon: "alert" },
} as const;

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[110] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-24"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const tone = TONES[t.tone];
        return (
          <div
            key={t.id}
            className="glass pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl p-4 pl-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]"
            style={{ animation: "toast-in 0.45s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <span className={cn("absolute left-0 top-0 h-full w-1", tone.bar)} />
            <span className={cn("mt-0.5 shrink-0", tone.text)}>
              <Icon name={tone.icon} className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.9rem] font-semibold text-bone-50">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[0.82rem] leading-snug text-mist-400">{t.body}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Cerrar aviso"
              className="shrink-0 rounded-full p-1 text-mist-500 transition-colors hover:text-bone-50"
            >
              <Icon name="close" className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        })
      }
      aria-label="Volver arriba"
      className={cn(
        "fixed bottom-5 right-5 z-[105] inline-flex h-12 w-12 items-center justify-center rounded-full border border-signal-500/35 bg-ink-900/85 text-signal-400 backdrop-blur transition-all duration-500 hover:border-signal-500 hover:bg-signal-500 hover:text-ink-950 sm:bottom-6 sm:right-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <Icon name="arrowDown" className="h-5 w-5 rotate-180" strokeWidth={2.2} />
    </button>
  );
}