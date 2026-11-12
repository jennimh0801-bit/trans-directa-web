import { MAX_SIZE_LABEL, MAX_WEIGHT_KG, SERVICES } from "@/lib/data";
import { INCLUDED_KM, eur } from "@/lib/pricing";
import { scrollToId, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

const PRICE_PARTS = [
  {
    icon: "bolt",
    title: "Servicio",
    body: "Tarifa base según la urgencia: urgente, mismo día o programado.",
  },
  {
    icon: "route",
    title: "Distancia",
    body: `Los primeros ${INCLUDED_KM} km están incluidos; el resto se calcula por kilómetro.`,
  },
  {
    icon: "package",
    title: "Peso y tamaño",
    body: `Paquetes de hasta ${MAX_WEIGHT_KG} kg y ${MAX_SIZE_LABEL}. Sin suplemento hasta 5 kg y caja pequeña.`,
  },
  {
    icon: "plus",
    title: "Extras opcionales",
    body: "Firma y DNI, espera ampliada o retorno de albarán, solo si los necesitas.",
  },
];

const PAY_STEPS = [
  {
    title: "Pides presupuesto",
    body: "Indicas recogida, destino y paquete, y ves el precio cerrado.",
  },
  {
    title: "Pagas al pedir la recogida",
    body: "Sin planes, cuotas ni permanencia: solo el envío que haces.",
  },
  {
    title: "Recogemos y entregamos",
    body: "Salimos lo antes posible y recibes la factura de tu envío.",
  },
];

export function Pricing() {
  const { quote, setQuote } = useStore();

  return (
    <section id="tarifas" className="on-light relative overflow-hidden bg-bone-100 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 50% 0%, rgba(30,107,255,0.10), transparent 65%), radial-gradient(45% 40% at 85% 60%, rgba(255,181,36,0.14), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHeading
          align="center"
          tone="light"
          eyebrow="Tarifas"
          icon="euro"
          title={
            <>
              Precio cerrado por envío.{" "}
              <span className="text-cobalt-600">Sin planes ni cuotas.</span>
            </>
          }
          lead="No hay planes mensuales ni permanencia. Pides presupuesto, ves el precio antes de confirmar y pagas en el momento de pedir la recogida."
        />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const selected = quote.service === s.id;
            return (
              <Reveal key={s.id} delay={i * 110} y={34}>
                <article
                  className={cn(
                    "card-hover relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 sm:p-8",
                    s.featured
                      ? "bg-gradient-to-b from-ink-900 via-ink-850 to-ink-950 text-bone-50 shadow-[0_50px_90px_-45px_rgba(5,8,11,0.85)] lg:-mt-4 lg:pb-10"
                      : "border border-ink-900/10 bg-white/85 text-ink-900 backdrop-blur",
                    selected && !s.featured && "border-cobalt-500/50 shadow-[0_24px_60px_-30px_rgba(11,79,214,0.5)]"
                  )}
                >
                  {s.featured && (
                    <>
                      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />
                      <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-signal-400 to-signal-600 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-950">
                        Más solicitado
                      </span>
                    </>
                  )}

                  <h3
                    className={cn(
                      "font-display text-[1.35rem] font-bold",
                      s.featured ? "text-bone-50" : "text-ink-900"
                    )}
                  >
                    {s.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 min-h-[2.6rem] text-[0.9rem] leading-relaxed",
                      s.featured ? "text-mist-400" : "text-ink-700/70"
                    )}
                  >
                    {s.desc}
                  </p>

                  <div className="mt-6">
                    <p
                      className={cn(
                        "text-[0.72rem] font-bold uppercase tracking-[0.14em]",
                        s.featured ? "text-mist-500" : "text-ink-700/55"
                      )}
                    >
                      Por envío, desde
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="font-display text-[2.7rem] font-extrabold leading-none tabular">
                        {eur(s.base)}
                      </span>
                      <span
                        className={cn(
                          "pb-1.5 text-[0.85rem]",
                          s.featured ? "text-mist-400" : "text-ink-700/60"
                        )}
                      >
                        + IVA
                      </span>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-[0.85rem] font-semibold",
                      s.featured ? "text-signal-400" : "text-cobalt-600"
                    )}
                  >
                    {s.eta} · {INCLUDED_KM} km incluidos
                  </p>

                  <ul className="mt-7 flex-1 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[0.9rem] leading-snug">
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            s.featured ? "bg-signal-500/20 text-signal-400" : "bg-mint-500/15 text-mint-600"
                          )}
                        >
                          <Icon name="check" className="h-3 w-3" strokeWidth={3.2} />
                        </span>
                        <span className={s.featured ? "text-mist-300" : "text-ink-700/85"}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-8 w-full"
                    size="lg"
                    variant={s.featured ? "primary" : "outline"}
                    icon="arrowRight"
                    onClick={() => {
                      setQuote("service", s.id);
                      scrollToId("reservar");
                    }}
                  >
                    Pedir presupuesto
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="mt-16">
          <div className="grain relative overflow-hidden rounded-[30px] bg-ink-950 p-6 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_15%_0%,rgba(30,107,255,0.22),transparent_60%),radial-gradient(50%_100%_at_95%_20%,rgba(255,181,36,0.16),transparent_65%)]"
            />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-signal-500/25 bg-signal-500/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-signal-300">
                  <Icon name="euro" className="h-3.5 w-3.5" />
                  Cómo se calcula el precio
                </span>
                <h3 className="mt-5 font-display text-[1.7rem] font-bold leading-tight text-bone-50 sm:text-[2.1rem]">
                  Sabes lo que pagas{" "}
                  <span className="text-gradient-signal">antes de que salgamos.</span>
                </h3>
                <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                  {PRICE_PARTS.map((p) => (
                    <li key={p.title} className="rounded-2xl border border-mist-400/12 bg-ink-900/60 p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-500/15 text-signal-400">
                        <Icon name={p.icon} className="h-4.5 w-4.5" />
                      </span>
                      <p className="mt-3 text-[0.95rem] font-semibold text-bone-50">{p.title}</p>
                      <p className="mt-1 text-[0.83rem] leading-relaxed text-mist-400">{p.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-between gap-6 rounded-[24px] border border-mist-400/12 bg-ink-900/70 p-6 backdrop-blur">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mist-500">
                    Cómo se paga
                  </p>
                  <ol className="mt-5 space-y-5">
                    {PAY_STEPS.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-mint-500/40 bg-mint-500/10 font-display text-[0.95rem] font-bold text-mint-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[0.95rem] font-semibold text-bone-50">{s.title}</p>
                          <p className="mt-1 text-[0.85rem] leading-relaxed text-mist-400">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-col gap-3 border-t border-mist-400/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[0.82rem] text-mist-400">Sin planes mensuales ni permanencia.</p>
                  <Button icon="arrowRight" onClick={() => scrollToId("reservar")}>
                    Pedir presupuesto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
