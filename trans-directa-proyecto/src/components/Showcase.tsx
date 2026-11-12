import { useMemo, useState } from "react";
import { IMAGES, SERVICES, STAGES } from "@/lib/data";
import { eur } from "@/lib/pricing";
import { scrollToId, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { CityMap } from "./CityMap";
import { Icon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

const TABS = [
  { id: "tracking", label: "Seguimiento del envío", icon: "radar", desc: "Dónde está y cuándo llega" },
  { id: "pod", label: "Prueba de entrega", icon: "signature", desc: "Firma, foto y hora" },
  { id: "pagos", label: "Pago por envío", icon: "euro", desc: "Sin planes ni cuotas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function TrackingPanel() {
  const { shipments, active, setActiveId } = useStore();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) =>
      `${s.id} ${s.origin} ${s.destination} ${s.contents}`.toLowerCase().includes(q)
    );
  }, [shipments, query]);

  const remaining = Math.max(0, Math.round((1 - active.progress) * active.etaMin));
  const delivered = active.progress >= 1;
  const stageIndex = STAGES.reduce((acc, s, i) => (active.progress >= s.at ? i : acc), 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, dirección o contenido…"
            aria-label="Buscar envíos"
            className="w-full rounded-xl border border-mist-400/18 bg-ink-900/70 py-2.5 pl-10 pr-3 text-[0.85rem] text-bone-50 outline-none transition-colors placeholder:text-mist-500 focus:border-signal-500/60"
          />
        </div>

        <div className="flex max-h-[168px] flex-col gap-2 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-mist-400/20 px-4 py-6 text-center text-[0.85rem] text-mist-500">
              Ningún envío coincide con «{query}».
            </p>
          )}
          {filtered.map((s) => {
            const on = s.id === active.id;
            const done = s.progress >= 1;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                aria-pressed={on}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300",
                  on
                    ? "border-signal-500/60 bg-signal-500/10"
                    : "border-mist-400/12 bg-ink-900/50 hover:border-mist-400/30"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    done ? "bg-mint-400" : "bg-flare-500 animate-pulse"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[0.78rem] font-semibold text-bone-50">{s.id}</span>
                    <span className="truncate text-[0.72rem] text-mist-500">{s.contents}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[0.78rem] text-mist-300">
                    {s.destination}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-[0.75rem] font-bold tabular",
                    done ? "text-mint-400" : "text-signal-400"
                  )}
                >
                  {done ? "OK" : `${Math.max(1, Math.round((1 - s.progress) * s.etaMin))}′`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-mist-400/12">
          <div className="relative aspect-[16/11] w-full">
            <CityMap
              progress={active.progress}
              delivered={delivered}
              seed={active.id.charCodeAt(4) + 5}
              className="absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div className="min-w-0 rounded-xl border border-mist-400/15 bg-ink-950/80 px-3 py-2 backdrop-blur">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist-500">Destino</p>
                <p className="max-w-[15rem] truncate text-[0.82rem] font-semibold text-bone-50">
                  {active.destination}
                </p>
              </div>
              <div
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-2 text-right backdrop-blur",
                  delivered
                    ? "border-mint-500/40 bg-mint-500/15"
                    : "border-signal-500/35 bg-ink-950/80"
                )}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist-400">Llegada aprox.</p>
                <p
                  className={cn(
                    "font-display text-lg font-extrabold tabular",
                    delivered ? "text-mint-300" : "text-signal-400"
                  )}
                >
                  {delivered ? "Entregado" : `${remaining} min`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-mist-400/12 bg-ink-900/60 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal-400 to-flare-500 text-ink-950">
              <Icon name="car" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-bone-50">{active.vehicle}</p>
              <p className="truncate text-[0.74rem] text-mist-400">Un único vehículo para tu envío</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-mint-500/25 bg-mint-500/10 px-2.5 py-1 text-[0.66rem] font-semibold text-mint-400">
              <Icon name="leaf" className="h-3 w-3" /> Híbrido
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Servicio", v: SERVICES.find((s) => s.id === active.service)?.name ?? "" },
              { k: "Importe", v: eur(active.price) },
              { k: "Escalas", v: "0" },
            ].map((x) => (
              <div key={x.k} className="rounded-lg bg-ink-850/80 px-2 py-2">
                <p className="truncate text-[0.78rem] font-bold text-bone-100">{x.v}</p>
                <p className="text-[0.62rem] uppercase tracking-wider text-mist-500">{x.k}</p>
              </div>
            ))}
          </div>
        </div>

        <ol className="relative flex-1 rounded-2xl border border-mist-400/12 bg-ink-900/60 p-4">
          {STAGES.map((stage, i) => {
            const done = active.progress >= stage.at && i <= stageIndex;
            const current = i === stageIndex && !delivered;
            return (
              <li key={stage.label} className="relative flex gap-3 pb-4 last:pb-0">
                {i < STAGES.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[9px] top-5 h-[calc(100%-1rem)] w-px",
                      active.progress >= STAGES[i + 1].at ? "bg-mint-500/50" : "bg-mist-400/18"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                    done
                      ? "border-mint-500/60 bg-mint-500/20 text-mint-300"
                      : "border-mist-400/25 bg-ink-850 text-mist-500"
                  )}
                >
                  {done ? (
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                  {current && (
                    <span className="pulse-ring absolute inset-0 rounded-full border border-signal-500" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[0.85rem] font-semibold transition-colors",
                      done ? "text-bone-50" : "text-mist-500"
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="block text-[0.74rem] text-mist-500">{stage.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function PodPanel() {
  const { active, pushToast } = useStore();
  const stamp = new Date(active.createdAt + active.etaMin * 60000);
  const fecha = stamp.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const hora = stamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const exportPod = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="480" viewBox="0 0 820 480">
<rect width="820" height="480" fill="#0a121a"/>
<rect x="24" y="24" width="772" height="432" rx="20" fill="none" stroke="#ffb524" stroke-opacity="0.4"/>
<text x="56" y="86" fill="#ffb524" font-family="monospace" font-size="16" letter-spacing="4">TRANS DIRECTA · PRUEBA DE ENTREGA (EJEMPLO)</text>
<text x="56" y="140" fill="#fcfaf6" font-family="sans-serif" font-size="38" font-weight="bold">${active.id}</text>
<text x="56" y="186" fill="#93a8bb" font-family="sans-serif" font-size="16">Origen: ${active.origin}</text>
<text x="56" y="214" fill="#93a8bb" font-family="sans-serif" font-size="16">Destino: ${active.destination}</text>
<text x="56" y="242" fill="#93a8bb" font-family="sans-serif" font-size="16">Contenido: ${active.contents}</text>
<text x="56" y="290" fill="#4bf0ac" font-family="sans-serif" font-size="18">Entregado el ${fecha} a las ${hora}</text>
<text x="56" y="322" fill="#93a8bb" font-family="sans-serif" font-size="15">Vehículo: ${active.vehicle} · trayecto directo, sin escalas</text>
<text x="56" y="350" fill="#93a8bb" font-family="sans-serif" font-size="15">Recibido por: M. Ferrer (DNI ****4821K)</text>
<path d="M56 410 c40 -34 60 22 92 -8 c26 -24 44 26 74 -4 c22 -22 40 14 66 -6" fill="none" stroke="#fcfaf6" stroke-width="3" stroke-linecap="round"/>
<text x="56" y="440" fill="#6b8296" font-family="monospace" font-size="12">Documento de demostración · Trans Directa</text>
</svg>`;
    download(`prueba-entrega-${active.id}.svg`, svg, "image/svg+xml");
    pushToast({
      tone: "cobalt",
      title: "Ejemplo descargado",
      body: `Prueba de entrega de ejemplo del envío ${active.id}.`,
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <div className="relative overflow-hidden rounded-2xl border border-mist-400/12">
        <img
          src={IMAGES.pod}
          alt="Entrega de un paquete con recogida de la firma del destinatario"
          loading="lazy"
          className="h-full min-h-[280px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-mint-500/40 bg-ink-950/80 px-3 py-1.5 backdrop-blur">
          <Icon name="check" className="h-3.5 w-3.5 text-mint-400" strokeWidth={3} />
          <span className="text-[0.72rem] font-semibold text-mint-300">Foto de entrega · {hora}</span>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <svg viewBox="0 0 260 60" className="h-14 w-44" aria-label="Firma del destinatario">
            <path
              d="M6 44c22-4 26-32 40-32s10 34 24 34 20-30 34-30 12 24 26 24 22-18 36-18 24 12 38 8"
              fill="none"
              stroke="#fcfaf6"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="330"
              strokeDashoffset="330"
              style={{ animation: "sign 2.6s ease-out forwards" }}
            />
            <style>{`@keyframes sign { to { stroke-dashoffset: 0 } }`}</style>
          </svg>
          <p className="text-[0.78rem] text-mist-300">M. Ferrer · DNI ****4821K</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-mist-400/12 bg-ink-900/60 p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mist-500">
            Prueba de entrega · ejemplo
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-bone-50">{active.id}</p>
          <dl className="mt-4 space-y-2.5 text-[0.85rem]">
            {[
              ["Fecha", `${fecha} · ${hora}`],
              ["Destino", active.destination],
              ["Contenido", active.contents],
              ["Vehículo", active.vehicle],
              ["Trayecto", "Directo, sin escalas"],
              ["Recibido por", "M. Ferrer"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 border-b border-mist-400/8 pb-2.5 last:border-0">
                <dt className="w-32 shrink-0 text-mist-500">{k}</dt>
                <dd className="min-w-0 flex-1 font-medium text-bone-100">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button icon="download" onClick={exportPod}>
            Descargar ejemplo
          </Button>
        </div>
        <p className="text-[0.8rem] leading-relaxed text-mist-500">
          Cada entrega queda documentada con la firma del destinatario, una foto y la hora exacta,
          para que tengas constancia de que tu paquete ha llegado.
        </p>
      </div>
    </div>
  );
}

function PaymentsPanel() {
  const { shipments } = useStore();
  const steps = [
    {
      title: "Pides presupuesto",
      body: "Indicas recogida, destino y paquete, y ves el precio cerrado antes de confirmar.",
    },
    {
      title: "Pagas al pedir la recogida",
      body: "Sin planes mensuales, cuotas ni permanencia: solo el envío que haces.",
    },
    {
      title: "Recibes la factura del envío",
      body: "Cada servicio queda documentado con su importe y su prueba de entrega.",
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-mist-400/12 bg-ink-900/60 p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mist-500">
          Así funciona el pago
        </p>
        <ol className="mt-5 space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-signal-500/40 bg-signal-500/10 font-display text-[0.95rem] font-bold text-signal-400">
                {i + 1}
              </span>
              <div>
                <p className="text-[0.95rem] font-semibold text-bone-50">{s.title}</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-mist-400">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Button
          className="mt-7 w-full"
          icon="arrowRight"
          onClick={() => scrollToId("reservar")}
        >
          Pedir presupuesto
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mist-400/12 bg-ink-900/60">
        <div className="flex items-center justify-between border-b border-mist-400/12 px-5 py-3.5">
          <p className="text-[0.8rem] font-semibold text-bone-100">Envíos de ejemplo</p>
          <span className="font-mono text-[0.72rem] text-mist-500">pago por envío</span>
        </div>
        <div className="max-h-[340px] overflow-y-auto">
          <table className="w-full text-left text-[0.82rem]">
            <thead className="sticky top-0 bg-ink-850/95 text-[0.68rem] uppercase tracking-wider text-mist-500 backdrop-blur">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-semibold">Envío</th>
                <th scope="col" className="px-2 py-2.5 font-semibold">Pago</th>
                <th scope="col" className="px-5 py-2.5 text-right font-semibold">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-400/8">
              {shipments.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <span className="block font-mono text-[0.78rem] font-semibold text-bone-50">{s.id}</span>
                    <span className="block max-w-[13rem] truncate text-[0.74rem] text-mist-500">
                      {s.destination}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="whitespace-nowrap rounded-full bg-mint-500/15 px-2 py-0.5 text-[0.68rem] font-semibold text-mint-400">
                      Al pedir la recogida
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-bone-100 tabular">
                    {eur(s.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [tab, setTab] = useState<TabId>("tracking");

  return (
    <section id="panel" className="grain relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_0%,rgba(30,107,255,0.18),transparent_65%)]" />
        <div className="aurora-blob absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-orchid-500/12" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Seguimiento"
              icon="layers"
              title={
                <>
                  Tu envío, a la vista{" "}
                  <span className="text-gradient-cobalt">de principio a fin.</span>
                </>
              }
              lead="Demostración interactiva con envíos de ejemplo: así verás tu paquete desde que pides la recogida hasta que se entrega."
            />

            <div
              role="tablist"
              aria-label="Vistas de la demostración"
              onKeyDown={(e) => {
                const vertical = e.key === "ArrowDown" || e.key === "ArrowUp";
                const horizontal = e.key === "ArrowRight" || e.key === "ArrowLeft";
                if (!vertical && !horizontal) return;
                e.preventDefault();
                const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
                const i = TABS.findIndex((t) => t.id === tab);
                const next = TABS[(i + dir + TABS.length) % TABS.length];
                setTab(next.id);
                document.getElementById(`tab-${next.id}`)?.focus();
              }}
              className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {TABS.map((t) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`tab-${t.id}`}
                    tabIndex={on ? 0 : -1}
                    aria-selected={on}
                    aria-controls={`panel-${t.id}`}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 lg:w-full",
                      on
                        ? "border-signal-500/45 bg-gradient-to-r from-signal-500/12 to-transparent"
                        : "border-mist-400/12 bg-ink-900/40 hover:border-mist-400/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                        on ? "bg-signal-500 text-ink-950" : "bg-ink-800 text-mist-400"
                      )}
                    >
                      <Icon name={t.icon} className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block whitespace-nowrap text-[0.9rem] font-semibold lg:whitespace-normal",
                          on ? "text-bone-50" : "text-mist-300"
                        )}
                      >
                        {t.label}
                      </span>
                      <span className="hidden text-[0.74rem] text-mist-500 lg:block">{t.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-mint-500/20 bg-mint-500/[0.06] px-4 py-3">
              <Icon name="car" className="h-5 w-5 shrink-0 text-mint-400" />
              <p className="text-[0.82rem] text-mist-300">
                <strong className="font-semibold text-bone-50">Un solo coche híbrido:</strong> tu
                paquete viaja sin compartir ruta.
              </p>
            </div>
          </div>

          <Reveal y={34}>
            <div className="glass rounded-[26px] p-4 sm:p-5">
              <div
                role="tabpanel"
                id={`panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
                key={tab}
                className="animate-[pop-in_0.4s_cubic-bezier(0.16,1,0.3,1)]"
              >
                {tab === "tracking" && <TrackingPanel />}
                {tab === "pod" && <PodPanel />}
                {tab === "pagos" && <PaymentsPanel />}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
