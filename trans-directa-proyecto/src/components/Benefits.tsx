import { BENEFITS, COMPARISON, IMAGES } from "@/lib/data";
import { useScrollProgress } from "@/hooks/useMotion";
import { scrollToId } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

export function Benefits() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const shift = (progress - 0.5) * 44;

  return (
    <section id="ventajas" className="on-light relative overflow-hidden bg-bone-50 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(70% 50% at 100% 10%, rgba(255,181,36,0.16), transparent 60%), radial-gradient(60% 50% at 0% 80%, rgba(18,179,201,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          <div ref={ref} className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={34}>
              <div className="relative overflow-hidden rounded-[28px] border border-ink-900/10 shadow-[0_40px_80px_-40px_rgba(5,8,11,0.6)]">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={IMAGES.highway}
                    alt="Coche circulando por una vía rápida al atardecer"
                    loading="lazy"
                    className="h-[112%] w-full object-cover"
                    style={{ transform: `translateY(${shift - 22}px)` }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="rounded-2xl border border-white/12 bg-ink-950/70 p-4 backdrop-blur-md">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-signal-400">
                      Un coche híbrido
                    </p>
                    <p className="mt-1.5 font-display text-[1.05rem] font-bold text-bone-50">
                      Menos consumo y menos emisiones
                    </p>
                    <p className="mt-1 text-[0.8rem] text-mist-400">
                      Un único vehículo dedicado a tu envío, de la recogida a la entrega.
                    </p>
                  </div>
                </div>
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-mint-400/30 bg-ink-950/70 px-3 py-1.5 backdrop-blur">
                  <Icon name="leaf" className="h-3.5 w-3.5 text-mint-400" />
                  <span className="text-[0.72rem] font-semibold text-mint-300">Híbrido</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { k: "1", v: "coche híbrido" },
                  { k: "4", v: "provincias" },
                  { k: "0", v: "cuotas" },
                ].map((x) => (
                  <div
                    key={x.v}
                    className="rounded-2xl border border-ink-900/8 bg-white/70 px-3 py-3.5 text-center backdrop-blur"
                  >
                    <p className="font-display text-lg font-extrabold text-ink-900">{x.k}</p>
                    <p className="text-[0.72rem] text-ink-700/65">{x.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <SectionHeading
              tone="light"
              eyebrow="Por qué elegirnos"
              icon="target"
              title={
                <>
                  Lo que gana tu empresa cuando{" "}
                  <span className="text-cobalt-600">el paquete deja de esperar.</span>
                </>
              }
              lead="Un servicio pequeño y directo, pensado para los envíos que no pueden entrar en una ruta de reparto convencional."
            />

            <div className="mt-10 space-y-3">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 90}>
                  <article className="group flex gap-5 rounded-2xl border border-transparent bg-white/60 p-5 transition-all duration-500 hover:border-cobalt-500/25 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(11,79,214,0.5)]">
                    <div className="w-[4.5rem] shrink-0">
                      <p className="font-display text-[1.65rem] font-extrabold leading-none text-ink-900 transition-colors duration-500 group-hover:text-cobalt-600">
                        {b.kpi}
                      </p>
                      <span className="mt-2 block h-0.5 w-8 rounded-full bg-signal-500 transition-all duration-500 group-hover:w-14" />
                    </div>
                    <div>
                      <h3 className="font-display text-[1.08rem] font-bold text-ink-900">{b.title}</h3>
                      <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-700/75">{b.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-10">
              <div className="overflow-hidden rounded-[24px] border border-ink-900/10 bg-white/80">
                <div className="border-b border-ink-900/8 px-5 py-4">
                  <h3 className="font-display text-[1.05rem] font-bold text-ink-900">
                    Trans Directa frente a la mensajería convencional
                  </h3>
                </div>
                <div className="on-light overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="text-[0.72rem] uppercase tracking-[0.12em] text-ink-700/60">
                        <th scope="col" className="px-5 py-3 font-semibold">Criterio</th>
                        {COMPARISON.columns.map((c, i) => (
                          <th
                            key={c}
                            scope="col"
                            className={cn(
                              "px-4 py-3 text-center font-bold",
                              i === 0 ? "bg-ink-950 text-signal-400" : ""
                            )}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/6">
                      {COMPARISON.rows.map((row) => (
                        <tr key={row.label} className="text-ink-800">
                          <th
                            scope="row"
                            className="px-5 py-3.5 text-[0.88rem] font-medium text-ink-700/85"
                          >
                            {row.label}
                          </th>
                          {row.values.map((v, i) => (
                            <td
                              key={i}
                              className={cn(
                                "px-4 py-3.5 text-center text-[0.88rem] font-medium",
                                i === 0 ? "bg-ink-950 text-bone-50" : "text-ink-700/80"
                              )}
                            >
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160} className="mt-7">
              <Button variant="dark" size="lg" icon="arrowRight" onClick={() => scrollToId("tarifas")}>
                Ver las tarifas
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
