import { ACCEPTED_GOODS, EXCLUDED_GOODS, FEATURES, SERVICES } from "@/lib/data";
import { eur } from "@/lib/pricing";
import { scrollToId, useQuote, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

function RouteMini() {
  return (
    <svg viewBox="0 0 320 90" className="mt-6 h-24 w-full" aria-hidden>
      <defs>
        <linearGradient id="rmini" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e6bff" />
          <stop offset="55%" stopColor="#12b3c9" />
          <stop offset="100%" stopColor="#ffb524" />
        </linearGradient>
      </defs>
      <path
        d="M18 70 H100 Q116 70 116 54 V34 Q116 18 132 18 H302"
        fill="none"
        stroke="rgba(19,34,45,0.12)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M18 70 H100 Q116 70 116 54 V34 Q116 18 132 18 H302"
        fill="none"
        stroke="url(#rmini)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="330"
        strokeDashoffset="330"
        style={{ animation: "dash-draw 3.6s cubic-bezier(0.65,0,0.35,1) infinite" }}
      />
      <circle cx="18" cy="70" r="6" fill="#13222d" />
      <circle cx="18" cy="70" r="2.5" fill="#ffb524" />
      <circle cx="302" cy="18" r="7" fill="#10d189" opacity="0.25" />
      <circle cx="302" cy="18" r="4" fill="#10d189" />
      <g>
        <rect x="-7" y="-4" width="14" height="8" rx="2.5" fill="#ffb524" stroke="#13222d" strokeWidth="1" />
        <animateMotion
          dur="3.6s"
          repeatCount="indefinite"
          rotate="auto"
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="spline"
          keySplines="0.65 0 0.35 1"
          path="M18 70 H100 Q116 70 116 54 V34 Q116 18 132 18 H302"
        />
      </g>
      <style>{`@keyframes dash-draw { 0% { stroke-dashoffset: 330 } 60%,100% { stroke-dashoffset: 0 } }`}</style>
    </svg>
  );
}

/** Desglose del presupuesto actual: el mismo que se ve en el formulario de recogida. */
function PriceMini() {
  const { quote } = useStore();
  const price = useQuote();
  const service = SERVICES.find((s) => s.id === quote.service);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-950 p-4 font-mono text-[0.74rem] leading-relaxed">
      <p className="mb-2.5 text-[0.66rem] uppercase tracking-[0.16em] text-mist-500">
        Ejemplo de presupuesto
      </p>
      <dl className="space-y-1.5">
        <div className="flex justify-between gap-3">
          <dt className="text-mist-300">Servicio {service?.name}</dt>
          <dd className="text-bone-100">{eur(price.base)}</dd>
        </div>
        {price.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-3">
            <dt className="min-w-0 truncate text-mist-300">{l.label}</dt>
            <dd className="shrink-0 text-bone-100">{eur(l.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 border-t border-mist-400/15 pt-2 font-bold">
          <dt className="text-signal-400">Total + IVA</dt>
          <dd className="text-signal-400">{eur(price.total)}</dd>
        </div>
      </dl>
      <p className="mt-2.5 text-mint-400">→ Se paga al pedir la recogida</p>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="servicio"
      className="on-light relative overflow-hidden bg-bone-100 py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 15% 0%, rgba(30,107,255,0.10), transparent 60%), radial-gradient(50% 40% at 90% 20%, rgba(255,181,36,0.16), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="light"
            eyebrow="Cómo funciona"
            icon="route"
            title={
              <>
                Un coche, un conductor,{" "}
                <span className="text-cobalt-600">cero intermediarios.</span>
              </>
            }
            lead="La mensajería tradicional está diseñada para miles de paquetes al día. Trans Directa está diseñada para el tuyo: el que no puede esperar."
            className="max-w-2xl"
          />
          <Reveal delay={200}>
            <div className="flex items-center gap-3 rounded-2xl border border-ink-900/10 bg-white/70 px-5 py-4 backdrop-blur">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
                <Icon name="pin" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-ink-900">Solo Catalunya</p>
                <p className="text-[0.8rem] text-ink-700/70">recogidas y entregas en todo el territorio</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 80}
              className={cn(f.span === "lg" && "lg:col-span-2")}
            >
              <article className="card-hover group relative h-full overflow-hidden rounded-[24px] border border-ink-900/8 bg-white/85 p-6 backdrop-blur-sm hover:border-cobalt-500/30 hover:shadow-[0_30px_60px_-30px_rgba(11,79,214,0.45)] sm:p-7">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-signal-400/25 to-cobalt-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950 text-signal-400 shadow-[0_10px_24px_-12px_rgba(5,8,11,0.9)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon name={f.icon} className="h-5.5 w-5.5" strokeWidth={1.7} />
                  </span>
                  <span className="rounded-full border border-ink-900/10 bg-bone-100 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-700/70">
                    {f.tag}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-[1.28rem] font-bold text-ink-900">
                  {f.title}
                </h3>
                <p className="relative mt-2.5 text-[0.95rem] leading-relaxed text-ink-700/75">
                  {f.body}
                </p>
                {i === 0 && <RouteMini />}
                {i === 5 && <PriceMini />}
              </article>
            </Reveal>
          ))}

          <Reveal delay={520}>
            <article className="card-hover relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-ink-900 via-ink-850 to-cobalt-700 p-7 text-bone-50">
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(255,181,36,0.16) 0 2px, transparent 2px 16px)",
                }}
              />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-500 text-ink-950">
                  <Icon name="package" className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-5 font-display text-[1.28rem] font-bold">Qué transportamos</h3>
                <p className="mt-2.5 text-[0.93rem] leading-relaxed text-mist-300">{ACCEPTED_GOODS}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-[0.85rem] leading-relaxed text-mist-400">
                  <strong className="font-semibold text-bone-100">Mercancías no admitidas.</strong>{" "}
                  {EXCLUDED_GOODS}
                </p>
              </div>
              <Button
                className="relative mt-7 w-full"
                icon="arrowRight"
                onClick={() => scrollToId("reservar")}
              >
                Pedir presupuesto
              </Button>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
