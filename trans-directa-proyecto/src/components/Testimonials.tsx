import { useEffect, useState } from "react";
import { COMMON_GOODS, EXCLUDED_GOODS, IMAGES, TESTIMONIALS } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMotion";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Reveal, SectionHeading } from "./ui";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const count = TESTIMONIALS.length;

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => window.clearInterval(t);
  }, [paused, reduced, count]);

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section
      id="clientes"
      className="grain relative overflow-hidden bg-ink-900 py-20 sm:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#0a1620_0%,#08131b_45%,#0b1a14_100%)]" />
        <div className="aurora-blob absolute right-0 top-10 h-96 w-96 rounded-full bg-mint-500/10" />
        <div
          className="aurora-blob absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-cobalt-600/18"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Clientes"
          icon="quote"
          title={
            <>
              Empresas que ya no dicen{" "}
              <span className="text-gradient-signal">«llega mañana».</span>
            </>
          }
          lead="Despachos, talleres y comercios de Catalunya que resuelven sus envíos urgentes sin depender de una ruta de reparto."
          className="max-w-2xl"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          <Reveal y={30}>
            <div
              role="group"
              aria-roledescription="carrusel"
              aria-label="Testimonios de clientes"
              tabIndex={0}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  go(1);
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  go(-1);
                }
              }}
              className="glass relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 sm:p-9"
            >
              <Icon name="quote" className="h-9 w-9 text-signal-500/60" />
              <div className="relative mt-5 overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                  aria-live="polite"
                >
                  {TESTIMONIALS.map((t, i) => (
                    <figure
                      key={t.name}
                      className="w-full shrink-0 pr-1"
                      aria-hidden={i !== index}
                      role="group"
                      aria-roledescription="diapositiva"
                      aria-label={`${i + 1} de ${count}`}
                    >
                      <blockquote className="text-pretty font-display text-[1.2rem] font-medium leading-[1.45] text-bone-50 sm:text-[1.5rem]">
                        «{t.quote}»
                      </blockquote>
                      <figcaption className="mt-7 flex flex-wrap items-center gap-4">
                        <img
                          src={t.avatar}
                          alt=""
                          loading="lazy"
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-signal-500/40"
                        />
                        <div className="min-w-0">
                          <p className="text-[0.95rem] font-semibold text-bone-50">{t.name}</p>
                          <p className="text-[0.82rem] text-mist-400">
                            {t.role} · {t.company}
                          </p>
                        </div>
                        <span className="ml-auto rounded-full border border-mint-500/30 bg-mint-500/10 px-3.5 py-1.5 text-[0.78rem] font-semibold text-mint-300">
                          {t.metric}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-mist-400/12 pt-5">
                <div className="flex gap-2" role="tablist" aria-label="Seleccionar testimonio">
                  {TESTIMONIALS.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Testimonio de ${t.company}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        i === index
                          ? "w-8 bg-gradient-to-r from-signal-400 to-signal-600"
                          : "w-2 bg-mist-400/30 hover:bg-mist-400/60"
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Testimonio anterior"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mist-400/20 text-mist-300 transition-all duration-300 hover:border-signal-500/50 hover:text-signal-400 active:scale-90"
                  >
                    <Icon name="chevronLeft" className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Siguiente testimonio"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mist-400/20 text-mist-300 transition-all duration-300 hover:border-signal-500/50 hover:text-signal-400 active:scale-90"
                  >
                    <Icon name="chevronRight" className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={120} y={30}>
              <article className="relative overflow-hidden rounded-[28px] border border-mist-400/12">
                <img
                  src={IMAGES.heroCar}
                  alt="Coche circulando de noche por una calle iluminada"
                  loading="lazy"
                  className="h-52 w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-signal-400">
                    Servicio directo
                  </p>
                  <p className="mt-1 font-display text-[1.15rem] font-bold text-bone-50">
                    Un coche, un envío y un único trayecto hasta el destino
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={200} y={30}>
              <div className="rounded-[28px] border border-mist-400/12 bg-ink-850/70 p-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mist-500">
                  Lo que más transportamos
                </p>
                <ul className="mt-5 space-y-3">
                  {COMMON_GOODS.map((g) => (
                    <li key={g} className="flex items-center gap-3 text-[0.9rem] text-mist-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-400">
                        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-mist-400/10 pt-4 text-[0.8rem] leading-relaxed text-mist-500">
                  {EXCLUDED_GOODS}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
