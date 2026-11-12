import { useEffect, useRef, useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/data";
import { scrollToId } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon, Logo } from "./Icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ids = ["inicio", ...NAV_LINKS.map((l) => l.id), "reservar"];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 180 : 0);
  };

  return (
    <>
      <a
        href="#servicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-signal-500 focus:px-5 focus:py-2.5 focus:font-semibold focus:text-ink-950"
      >
        Saltar al contenido
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled ? "py-2" : "py-3.5"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: "linear-gradient(180deg, rgba(5,8,11,0.92), rgba(5,8,11,0.72))",
            backdropFilter: "blur(18px) saturate(150%)",
            WebkitBackdropFilter: "blur(18px) saturate(150%)",
            borderBottom: "1px solid rgba(147,168,187,0.12)",
          }}
        />
        <div className="relative mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              go("inicio");
            }}
            className="shrink-0"
            aria-label="Trans Directa, inicio"
          >
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-mist-400/12 bg-ink-900/40 p-1 backdrop-blur-md">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.id);
                    }}
                    aria-current={active === link.id ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-[0.85rem] font-medium transition-colors duration-300",
                      active === link.id
                        ? "text-ink-950"
                        : "text-mist-300 hover:text-bone-50"
                    )}
                  >
                    {active === link.id && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-signal-400 to-signal-500 shadow-[0_6px_18px_-6px_rgba(255,181,36,0.9)]" />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:+34${BRAND.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 rounded-full border border-mist-400/20 px-4 py-2.5 text-[0.85rem] font-semibold text-bone-100 transition-colors duration-300 hover:border-signal-500/50 hover:text-signal-400 xl:inline-flex"
            >
              <Icon name="phone" className="h-4 w-4" strokeWidth={1.8} />
              {BRAND.phone}
            </a>
            <button
              type="button"
              onClick={() => go("reservar")}
              className="btn-sheen hidden rounded-full bg-gradient-to-r from-signal-400 via-signal-500 to-signal-600 px-5 py-2.5 text-[0.86rem] font-bold text-ink-950 shadow-[0_12px_30px_-12px_rgba(255,181,36,0.95)] transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:block"
            >
              Pedir presupuesto
            </button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-mist-400/20 bg-ink-900/60 text-bone-100 transition-colors hover:border-signal-500/50 lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" strokeWidth={1.9} />
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-2 h-px max-w-[1240px] px-5 sm:px-8">
          <div
            className="h-px origin-left bg-gradient-to-r from-signal-500 via-flare-500 to-cobalt-500 transition-transform duration-150"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {/* Panel móvil */}
      <div
        id="menu-movil"
        ref={panelRef}
        className={cn(
          "fixed inset-0 z-[99] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink-950/85 backdrop-blur-xl transition-opacity duration-400",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-0 origin-top overflow-hidden rounded-b-[28px] border-b border-mist-400/12 bg-gradient-to-b from-ink-900 to-ink-850 px-5 pb-8 pt-24 transition-all duration-500",
            open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          )}
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.id}
                style={{ transitionDelay: `${open ? 90 + i * 45 : 0}ms` }}
                className={cn(
                  "border-b border-mist-400/10 transition-all duration-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                )}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id);
                  }}
                  className="flex items-center justify-between py-4 font-display text-xl font-semibold text-bone-50"
                >
                  {link.label}
                  <Icon
                    name="arrowUpRight"
                    className={cn("h-5 w-5", active === link.id ? "text-signal-500" : "text-mist-500")}
                  />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => go("reservar")}
              className="w-full rounded-full bg-gradient-to-r from-signal-400 to-signal-600 px-6 py-4 font-display text-base font-bold text-ink-950"
            >
              Pedir presupuesto
            </button>
            <a
              href={`tel:+34${BRAND.phone.replace(/\s/g, "")}`}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-mist-400/25 px-6 py-3.5 font-semibold text-bone-100"
            >
              <Icon name="phone" className="h-4 w-4" />
              {BRAND.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}