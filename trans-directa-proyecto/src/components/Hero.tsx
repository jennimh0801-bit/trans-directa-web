import { CITIES, MAX_DISTANCE_KM, SERVICES } from "@/lib/data";
import { eur, formatEta, num } from "@/lib/pricing";
import { scrollToId, useQuote, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { CityMap } from "./CityMap";
import { Icon } from "./Icons";
import { Button, Eyebrow, RangeInput, Reveal } from "./ui";

function LiveCard() {
  const { active } = useStore();
  const remaining = Math.max(0, (1 - active.progress) * active.etaMin * 60);
  const mm = Math.floor(remaining / 60);
  const ss = Math.floor(remaining % 60);
  const delivered = active.progress >= 1;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[42px] bg-gradient-to-br from-cobalt-500/25 via-transparent to-signal-500/20 blur-2xl"
      />
      <div className="glass overflow-hidden rounded-[28px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between gap-3 border-b border-mist-400/12 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-flare-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flare-500" />
            </span>
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-bone-100">
              Ejemplo
            </span>
            <span className="font-mono text-[0.78rem] text-mist-400">{active.id}</span>
          </div>
          <span className="rounded-full border border-flare-500/30 bg-flare-500/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-flare-400">
            {SERVICES.find((s) => s.id === active.service)?.name}
          </span>
        </div>

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
          <CityMap
            progress={active.progress}
            delivered={delivered}
            className="absolute inset-0 h-full w-full"
            seed={11}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <div className="max-w-[58%] rounded-xl border border-mist-400/15 bg-ink-950/70 px-3 py-2 backdrop-blur-md">
              <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-signal-400">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-500" />
                Recogida
              </p>
              <p className="truncate text-[0.8rem] font-medium text-bone-100">{active.origin}</p>
            </div>
            <div className="rounded-xl border border-mist-400/15 bg-ink-950/70 px-3 py-2 text-right backdrop-blur-md">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mist-400">
                {delivered ? "Entregado" : "Llegada aprox."}
              </p>
              <p
                className={cn(
                  "font-mono text-lg font-bold tabular",
                  delivered ? "text-mint-400" : "text-bone-50"
                )}
              >
                {delivered ? "✓ Firma" : `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent p-4 pt-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cobalt-400 to-cobalt-600 text-white">
                <Icon name="car" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.86rem] font-semibold text-bone-50">
                  {active.vehicle} · Trans Directa
                </p>
                <p className="truncate text-[0.72rem] text-mist-400">{active.destination}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-signal-400 tabular">
                  {Math.round(active.progress * 100)}%
                </p>
                <p className="text-[0.66rem] uppercase tracking-wider text-mist-500">trayecto</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700 ease-out",
                  delivered
                    ? "bg-gradient-to-r from-mint-500 to-mint-300"
                    : "bg-gradient-to-r from-cobalt-500 via-aqua-400 to-signal-500"
                )}
                style={{ width: `${Math.max(3, active.progress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-mist-400/10 border-t border-mist-400/12 text-center">
          {[
            { k: "Escalas", v: "0" },
            { k: "Vehículo", v: "Híbrido" },
            { k: "Zona", v: "Catalunya" },
          ].map((s) => (
            <div key={s.k} className="px-2 py-3">
              <p className="font-display text-[0.95rem] font-bold text-bone-50">{s.v}</p>
              <p className="text-[0.64rem] uppercase tracking-[0.14em] text-mist-500">{s.k}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="float-slow absolute -left-4 bottom-16 hidden rounded-2xl border border-mint-500/25 bg-ink-900/90 px-4 py-3 shadow-lift backdrop-blur-md xl:block">
        <p className="font-display text-xl font-extrabold text-mint-400">Sin escalas</p>
        <p className="text-[0.7rem] text-mist-400">de puerta a puerta</p>
      </div>
      <div
        className="float-slow absolute -right-5 top-24 hidden rounded-2xl border border-signal-500/25 bg-ink-900/90 px-4 py-3 shadow-lift backdrop-blur-md xl:block"
        style={{ animationDelay: "1.4s" }}
      >
        <p className="font-display text-xl font-extrabold text-signal-400">Sin cuotas</p>
        <p className="text-[0.7rem] text-mist-400">pagas por envío</p>
      </div>
    </div>
  );
}

function QuickQuote() {
  const { quote, setQuote } = useStore();
  const price = useQuote();

  return (
    <Reveal delay={520} className="mt-14 lg:mt-20">
      <div className="glass relative overflow-hidden rounded-[26px] p-5 sm:p-6">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px hairline" />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.25fr_auto] lg:items-center lg:gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="qq-city"
                className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mist-400"
              >
                Recogida en
              </label>
              <div className="relative">
                <select
                  id="qq-city"
                  value={quote.city}
                  onChange={(e) => setQuote("city", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-mist-400/20 bg-ink-900/70 px-3.5 py-2.5 pr-9 text-[0.9rem] font-medium text-bone-50 outline-none transition-colors focus:border-signal-500/70"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-ink-900">
                      {c}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
                />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="qq-km"
                  className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mist-400"
                >
                  Distancia
                </label>
                <span className="font-mono text-[0.8rem] font-semibold text-signal-400 tabular">
                  {num(quote.distanceKm)} km
                </span>
              </div>
              <RangeInput
                id="qq-km"
                ariaLabel="Distancia del trayecto en kilómetros"
                min={1}
                max={MAX_DISTANCE_KM}
                value={quote.distanceKm}
                onChange={(v) => setQuote("distanceKm", v)}
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mist-400">
              Servicio
            </p>
            <div className="grid grid-cols-1 gap-2 min-[440px]:grid-cols-3">
              {SERVICES.map((s) => {
                const on = quote.service === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setQuote("service", s.id)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left transition-all duration-300",
                      on
                        ? "border-signal-500/70 bg-signal-500/12 shadow-[0_0_0_1px_rgba(255,181,36,0.25)]"
                        : "border-mist-400/15 bg-ink-900/40 hover:border-mist-400/35"
                    )}
                  >
                    <span
                      className={cn(
                        "block text-[0.82rem] font-semibold",
                        on ? "text-signal-300" : "text-bone-100"
                      )}
                    >
                      {s.name}
                    </span>
                    <span className="block text-[0.68rem] text-mist-500">{s.eta}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 border-t border-mist-400/12 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mist-400">
                Presupuesto desde
              </p>
              <p
                key={price.total}
                className="font-display text-3xl font-extrabold text-bone-50 tabular animate-[pop-in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
              >
                {eur(price.total)}
              </p>
              <p className="text-[0.72rem] text-mist-500">
                + IVA · trayecto ≈ {formatEta(price.etaMin)}
              </p>
            </div>
            <Button size="lg" icon="arrowRight" onClick={() => scrollToId("reservar")}>
              Pedir recogida
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="grain relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0f2233_0%,#070d14_45%,#05080b_100%)]" />
        <div className="aurora-blob absolute -left-24 top-10 h-[26rem] w-[26rem] rounded-full bg-cobalt-600/30" />
        <div
          className="aurora-blob absolute -right-16 top-0 h-[24rem] w-[24rem] rounded-full bg-signal-600/20"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="aurora-blob absolute bottom-0 left-1/3 h-[20rem] w-[20rem] rounded-full bg-aqua-500/14"
          style={{ animationDelay: "-13s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(147,168,187,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(147,168,187,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(80% 60% at 50% 30%, #000 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(80% 60% at 50% 30%, #000 20%, transparent 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal>
              <Eyebrow icon="bolt">Empresas · Catalunya · Coche híbrido</Eyebrow>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 text-balance font-display text-[2.6rem] font-extrabold leading-[1.02] text-bone-50 sm:text-[3.4rem] lg:text-[4.05rem]">
                Tu paquete urgente,{" "}
                <span className="text-gradient-signal">en coche</span> y sin escalas.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-mist-300 sm:text-[1.15rem]">
                Recogemos <strong className="font-semibold text-bone-50">lo antes posible</strong> y
                llevamos tu envío directo a su destino para entregarlo{" "}
                <strong className="font-semibold text-bone-50">lo más rápido posible</strong>, en
                cualquier punto de Catalunya. Un coche híbrido, un trayecto directo y un precio
                cerrado antes de salir.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" icon="arrowRight" onClick={() => scrollToId("reservar")}>
                  Pedir presupuesto
                </Button>
                <Button size="lg" variant="ghost" icon="radar" onClick={() => scrollToId("panel")}>
                  Ver el seguimiento
                </Button>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <div className="flex items-center gap-2 text-[0.85rem] text-mist-400">
                  <Icon name="route" className="h-4 w-4 text-mint-400" />
                  Trayecto directo, sin escalas
                </div>
                <div className="flex items-center gap-2 text-[0.85rem] text-mist-400">
                  <Icon name="leaf" className="h-4 w-4 text-mint-400" />
                  Coche híbrido
                </div>
                <div className="flex items-center gap-2 text-[0.85rem] text-mist-400">
                  <Icon name="check" className="h-4 w-4 text-mint-400" strokeWidth={2.2} />
                  Sin cuotas ni permanencia
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={220} y={40}>
            <LiveCard />
          </Reveal>
        </div>

        <QuickQuote />
      </div>

      <div aria-hidden className="road-line mx-auto mt-16 h-[3px] w-full max-w-[1240px] opacity-40" />
    </section>
  );
}
