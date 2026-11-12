import { useEffect, useRef, useState } from "react";
import {
  ADDRESS_HINTS,
  BRAND,
  CITIES,
  EXCLUDED_GOODS,
  EXTRAS,
  IMAGES,
  MAX_DISTANCE_KM,
  MAX_SIZE_LABEL,
  MAX_WEIGHT_KG,
  OTHER_CITY,
  SERVICES,
  SIZES,
  cityLabel,
} from "@/lib/data";
import { eur, formatEta, num } from "@/lib/pricing";
import { scrollToId, useQuote, useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Button, Field, RangeInput, Reveal, inputClass } from "./ui";

const STEPS = [
  { n: 1, label: "Ruta", icon: "pin" },
  { n: 2, label: "Paquete", icon: "package" },
  { n: 3, label: "Contacto", icon: "user" },
];

const PICKUP_NOTE: Record<string, string> = {
  urgente: "Salimos hacia allí lo antes posible.",
  mismodia: "Recogeremos y entregaremos tu paquete durante el día.",
  programado: "Recogeremos tu paquete en la fecha y la hora indicadas.",
};

type Errors = Record<string, string>;

export function Booking() {
  const { quote, setQuote, toggleExtra, createShipment, pushToast, setActiveId } = useStore();
  const price = useQuote();

  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [schedule, setSchedule] = useState("");
  const [contents, setContents] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [payError, setPayError] = useState("");
  const [confirmed, setConfirmed] = useState<{
    id: string;
    eta: number;
    gross: number;
    note: string;
    origin: string;
    email: string;
  } | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  // Al volver desde Stripe Checkout (éxito o cancelación), comprobamos el pago
  // contra el servidor (nunca nos fiamos de los parámetros de la URL a secas).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pago = params.get("pago");
    if (!pago) return;

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("pago");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.pathname + url.hash);
    };

    if (pago === "cancelado") {
      pushToast({
        tone: "flare",
        title: "Pago cancelado",
        body: "No se ha realizado ningún cargo. Puedes volver a intentarlo cuando quieras.",
      });
      cleanUrl();
      return;
    }

    const sessionId = params.get("session_id");
    if (pago === "ok" && sessionId) {
      setSending(true);
      fetch(`/.netlify/functions/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.paid) {
            pushToast({
              tone: "flare",
              title: "No hemos podido confirmar el pago",
              body: "Si has pagado y ves este aviso, escríbenos y lo revisamos.",
            });
            return;
          }
          const m = data.metadata || {};
          const gross = Number(m.gross) || data.amountTotal / 100;
          const eta = Number(m.etaMin) || 0;
          const id = createShipment({
            origin: `${m.company ?? ""} · ${m.origin ?? ""}`,
            destination: m.destination ?? "",
            contents: m.contents || "Envío",
            price: gross,
            etaMin: eta,
          });
          setConfirmed({
            id,
            eta,
            gross,
            note: PICKUP_NOTE[m.service as string] ?? PICKUP_NOTE.urgente,
            origin: m.origin ?? "",
            email: data.email ?? "",
          });
          pushToast({
            tone: "mint",
            title: `Pago recibido · ${id}`,
            body: "Recogida confirmada y pagada.",
          });
        })
        .catch(() => {
          pushToast({
            tone: "flare",
            title: "Error al comprobar el pago",
            body: "Escríbenos si el cargo se ha realizado.",
          });
        })
        .finally(() => {
          setSending(false);
          cleanUrl();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hints =
    ADDRESS_HINTS[quote.city] ??
    (quote.city === OTHER_CITY
      ? []
      : [
          `Carrer Major 12, ${quote.city}`,
          `Polígon Industrial, ${quote.city}`,
          `Plaça de l'Ajuntament 1, ${quote.city}`,
        ]);

  const validate = (target: number): Errors => {
    const e: Errors = {};
    if (target > 1) {
      if (origin.trim().length < 5) e.origin = "Indica la dirección completa de recogida.";
      if (destination.trim().length < 5) e.destination = "Indica la dirección completa de entrega.";
    }
    if (target > 2) {
      if (quote.service === "programado" && !schedule)
        e.schedule = "Elige la fecha y la hora de recogida.";
    }
    if (target > 3) {
      if (company.trim().length < 2) e.company = "Falta el nombre de tu empresa.";
      if (name.trim().length < 2) e.name = "¿Quién autoriza la recogida?";
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim()))
        e.email = "Necesitamos un email válido para enviarte la confirmación.";
      if (phone.replace(/\D/g, "").length < 9) e.phone = "Teléfono de contacto de 9 dígitos.";
      if (!privacy) e.privacy = "Debes aceptar la política de privacidad.";
    }
    return e;
  };

  const focusError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`bk-${first}`)?.focus();
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(step < 3 ? step + 1 : 4);
    setErrors(e);
    if (Object.keys(e).length) {
      focusError(e);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setPayError("");
    setSending(true);
    fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: quote.city,
        distanceKm: quote.distanceKm,
        service: quote.service,
        size: quote.size,
        weightKg: quote.weightKg,
        extras: quote.extras,
        company: company.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        origin: origin.trim(),
        destination: destination.trim(),
        contents:
          contents.trim() ||
          `${SIZES.find((s) => s.id === quote.size)?.name} · ${num(quote.weightKg)} kg`,
      }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || !data.url) throw new Error(data.error || "No se ha podido iniciar el pago.");
        window.location.href = data.url;
      })
      .catch((err: Error) => {
        setSending(false);
        setPayError(err.message || "No se ha podido iniciar el pago. Inténtalo de nuevo.");
        pushToast({ tone: "flare", title: "No se ha podido iniciar el pago", body: err.message });
      });
  };

  const reset = () => {
    setConfirmed(null);
    setStep(1);
    setOrigin("");
    setDestination("");
    setContents("");
    setSchedule("");
    setErrors({});
  };

  const serviceName = SERVICES.find((s) => s.id === quote.service)?.name ?? "";

  return (
    <section id="reservar" className="grain relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img src={IMAGES.cityNight} alt="" loading="lazy" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,0.86)_35%,rgba(5,8,11,0.94)_70%,#05080b_100%)]" />
        <div className="aurora-blob absolute left-1/4 top-10 h-80 w-80 rounded-full bg-signal-600/18" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-flare-500/30 bg-flare-500/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-flare-400">
                <span className="relative flex h-2 w-2">
                  <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-flare-500" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-flare-500" />
                </span>
                Recogidas en toda Catalunya
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-6 max-w-2xl text-balance font-display text-[2.1rem] font-extrabold leading-[1.05] text-bone-50 sm:text-[3rem]">
                Pide presupuesto y{" "}
                <span className="text-gradient-signal">solicita tu recogida.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-mist-300">
                Sin planes ni cuotas. Ves el precio cerrado antes de confirmar y pagas en el momento
                de pedir la recogida.
              </p>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {["Precio cerrado", "Pago al pedir la recogida", "Sin permanencia"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-mist-400/18 bg-ink-900/60 px-3.5 py-2 text-[0.8rem] font-medium text-mist-300 backdrop-blur"
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-mint-400" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={140} y={36} className="mt-12">
          <div className="glass overflow-hidden rounded-[30px]">
            {confirmed ? (
              <div className="relative flex flex-col items-center px-6 py-14 text-center sm:px-10">
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-mint-500/15">
                  <span className="pulse-ring absolute inset-0 rounded-full border-2 border-mint-400" />
                  <Icon name="check" className="h-9 w-9 text-mint-400" strokeWidth={2.6} />
                </span>
                <h3 className="mt-6 font-display text-[1.8rem] font-extrabold text-bone-50 sm:text-[2.2rem]">
                  Recogida solicitada
                </h3>
                <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-mist-300">
                  Hemos registrado tu recogida en{" "}
                  <strong className="font-semibold text-bone-100">{confirmed.origin}</strong>.{" "}
                  {confirmed.note} Te enviaremos la confirmación a{" "}
                  <strong className="font-semibold text-bone-100">{confirmed.email}</strong>.
                </p>

                <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-3">
                  {[
                    { k: "Envío", v: confirmed.id },
                    { k: "Trayecto aprox.", v: formatEta(confirmed.eta) },
                    { k: "Importe (IVA incl.)", v: eur(confirmed.gross) },
                  ].map((x) => (
                    <div key={x.k} className="rounded-2xl border border-mist-400/15 bg-ink-900/60 px-4 py-3.5">
                      <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-mist-500">
                        {x.k}
                      </p>
                      <p className="mt-1 font-mono text-[1.05rem] font-bold text-signal-400">{x.v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    icon="radar"
                    onClick={() => {
                      setActiveId(confirmed.id);
                      scrollToId("panel");
                    }}
                  >
                    Ver el seguimiento
                  </Button>
                  <Button size="lg" variant="ghost" icon="refresh" onClick={reset}>
                    Pedir otra recogida
                  </Button>
                </div>
                <p className="mt-6 text-[0.82rem] text-mist-500">
                  ¿Algo que cambiar? Llama al {BRAND.phone} y lo ajustamos.
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-9">
                  <ol className="flex items-center gap-2">
                    {STEPS.map((s, i) => {
                      const state = step === s.n ? "current" : step > s.n ? "done" : "todo";
                      return (
                        <li key={s.n} className="flex flex-1 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (s.n < step) setStep(s.n);
                            }}
                            disabled={s.n > step}
                            aria-current={state === "current" ? "step" : undefined}
                            className={cn(
                              "flex items-center gap-2.5 rounded-full py-1 pr-2 text-left transition-opacity",
                              s.n > step ? "cursor-default opacity-55" : "cursor-pointer"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                                state === "current" &&
                                  "border-signal-500 bg-signal-500 text-ink-950 shadow-[0_0_18px_rgba(255,181,36,0.5)]",
                                state === "done" && "border-mint-500/50 bg-mint-500/15 text-mint-400",
                                state === "todo" && "border-mist-400/25 text-mist-500"
                              )}
                            >
                              {state === "done" ? (
                                <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                              ) : (
                                <Icon name={s.icon} className="h-4 w-4" />
                              )}
                            </span>
                            <span
                              className={cn(
                                "hidden text-[0.85rem] font-semibold sm:block",
                                state === "todo" ? "text-mist-500" : "text-bone-50"
                              )}
                            >
                              {s.label}
                            </span>
                          </button>
                          {i < STEPS.length - 1 && (
                            <span className="h-px flex-1 bg-gradient-to-r from-mist-400/30 to-mist-400/5" />
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div key={step} className="mt-8 animate-[pop-in_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    {step === 1 && (
                      <div className="grid gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id="bk-city" label="Población de recogida">
                            <div className="relative">
                              <select
                                id="bk-city"
                                value={quote.city}
                                onChange={(e) => setQuote("city", e.target.value)}
                                className={cn(inputClass, "appearance-none pr-10")}
                              >
                                {CITIES.map((c) => (
                                  <option key={c} value={c} className="bg-ink-900">
                                    {c}
                                  </option>
                                ))}
                              </select>
                              <Icon
                                name="chevronDown"
                                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
                              />
                            </div>
                          </Field>
                          <Field id="bk-km" label="Distancia" hint={`${num(quote.distanceKm)} km`}>
                            <div className="pt-2.5">
                              <RangeInput
                                id="bk-km"
                                ariaLabel="Distancia en kilómetros"
                                min={1}
                                max={MAX_DISTANCE_KM}
                                value={quote.distanceKm}
                                onChange={(v) => setQuote("distanceKm", v)}
                              />
                            </div>
                          </Field>
                        </div>

                        <datalist id="bk-hints">
                          {hints.map((h) => (
                            <option key={h} value={h} />
                          ))}
                        </datalist>

                        <Field id="bk-origin" label="Dirección de recogida" error={errors.origin}>
                          <input
                            id="bk-origin"
                            list="bk-hints"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Calle, número, planta o muelle"
                            autoComplete="off"
                            className={cn(inputClass, errors.origin && "border-flare-500/70")}
                          />
                        </Field>

                        <Field id="bk-destination" label="Dirección de entrega" error={errors.destination}>
                          <input
                            id="bk-destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destino en Catalunya y persona de contacto"
                            autoComplete="off"
                            className={cn(inputClass, errors.destination && "border-flare-500/70")}
                          />
                        </Field>

                        <div className="flex items-start gap-3 rounded-2xl border border-cobalt-500/25 bg-cobalt-700/10 p-4">
                          <Icon name="pin" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt-300" />
                          <p className="text-[0.83rem] leading-relaxed text-mist-300">
                            Operamos únicamente en Catalunya: la recogida y la entrega deben estar
                            dentro del territorio catalán.
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid gap-6">
                        <div>
                          <p className="mb-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-mist-400">
                            Tipo de servicio
                          </p>
                          <div className="grid gap-2.5 sm:grid-cols-3">
                            {SERVICES.map((s) => {
                              const on = quote.service === s.id;
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setQuote("service", s.id)}
                                  aria-pressed={on}
                                  className={cn(
                                    "rounded-2xl border p-4 text-left transition-all duration-300",
                                    on
                                      ? "border-signal-500/60 bg-signal-500/10"
                                      : "border-mist-400/15 bg-ink-900/40 hover:border-mist-400/35"
                                  )}
                                >
                                  <span className={cn("block text-[0.95rem] font-bold", on ? "text-signal-300" : "text-bone-50")}>
                                    {s.name}
                                  </span>
                                  <span className="mt-0.5 block font-mono text-[0.72rem] text-mist-400">{s.eta}</span>
                                  <span className="mt-1.5 block text-[0.8rem] leading-snug text-mist-400">{s.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                          {quote.service === "programado" && (
                            <div className="mt-4">
                              <Field id="bk-schedule" label="Fecha y hora de recogida" error={errors.schedule}>
                                <input
                                  id="bk-schedule"
                                  type="datetime-local"
                                  value={schedule}
                                  onChange={(e) => setSchedule(e.target.value)}
                                  className={cn(
                                    inputClass,
                                    "[color-scheme:dark]",
                                    errors.schedule && "border-flare-500/70"
                                  )}
                                />
                              </Field>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id="bk-size" label="Tamaño del bulto">
                            <div className="relative">
                              <select
                                id="bk-size"
                                value={quote.size}
                                onChange={(e) => setQuote("size", e.target.value as typeof quote.size)}
                                className={cn(inputClass, "appearance-none pr-10")}
                              >
                                {SIZES.map((s) => (
                                  <option key={s.id} value={s.id} className="bg-ink-900">
                                    {s.name} · {s.dims}
                                  </option>
                                ))}
                              </select>
                              <Icon
                                name="chevronDown"
                                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
                              />
                            </div>
                          </Field>
                          <Field id="bk-weight" label="Peso" hint={`${num(quote.weightKg)} kg`}>
                            <div className="pt-2.5">
                              <RangeInput
                                id="bk-weight"
                                ariaLabel="Peso del bulto en kilogramos"
                                min={1}
                                max={MAX_WEIGHT_KG}
                                value={quote.weightKg}
                                onChange={(v) => setQuote("weightKg", v)}
                              />
                            </div>
                          </Field>
                        </div>

                        <Field id="bk-contents" label="¿Qué llevamos?" hint="opcional">
                          <input
                            id="bk-contents"
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                            placeholder="Contrato original, repuesto, pedido de tienda…"
                            className={inputClass}
                          />
                        </Field>

                        <div className="flex items-start gap-3 rounded-2xl border border-mist-400/15 bg-ink-900/40 p-4">
                          <Icon name="alert" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-signal-400" />
                          <p className="text-[0.82rem] leading-relaxed text-mist-400">
                            Admitimos paquetes de hasta {MAX_WEIGHT_KG} kg y {MAX_SIZE_LABEL}.{" "}
                            {EXCLUDED_GOODS}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-mist-400">
                            Extras opcionales
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {EXTRAS.map((x) => {
                              const on = quote.extras.includes(x.id);
                              return (
                                <button
                                  key={x.id}
                                  type="button"
                                  onClick={() => toggleExtra(x.id)}
                                  aria-pressed={on}
                                  title={x.desc}
                                  className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.83rem] font-medium transition-all duration-300",
                                    on
                                      ? "border-mint-500/50 bg-mint-500/12 text-mint-300"
                                      : "border-mist-400/18 text-mist-300 hover:border-mist-400/40"
                                  )}
                                >
                                  <Icon name={on ? "check" : "plus"} className="h-3.5 w-3.5" strokeWidth={2.6} />
                                  {x.name}
                                  <span className="font-mono text-[0.72rem] opacity-70">+{x.fee.toFixed(2)} €</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id="bk-company" label="Empresa" error={errors.company}>
                            <input
                              id="bk-company"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="Nombre de tu empresa"
                              autoComplete="organization"
                              className={cn(inputClass, errors.company && "border-flare-500/70")}
                            />
                          </Field>
                          <Field id="bk-name" label="Persona de contacto" error={errors.name}>
                            <input
                              id="bk-name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Nombre y apellido"
                              autoComplete="name"
                              className={cn(inputClass, errors.name && "border-flare-500/70")}
                            />
                          </Field>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id="bk-email" label="Email" error={errors.email}>
                            <input
                              id="bk-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="nombre@tuempresa.cat"
                              autoComplete="email"
                              className={cn(inputClass, errors.email && "border-flare-500/70")}
                            />
                          </Field>
                          <Field id="bk-phone" label="Teléfono" error={errors.phone}>
                            <input
                              id="bk-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="600 000 000"
                              autoComplete="tel"
                              className={cn(inputClass, errors.phone && "border-flare-500/70")}
                            />
                          </Field>
                        </div>

                        <label
                          htmlFor="bk-privacy"
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                            errors.privacy ? "border-flare-500/60 bg-flare-500/5" : "border-mist-400/15 bg-ink-900/40"
                          )}
                        >
                          <input
                            id="bk-privacy"
                            type="checkbox"
                            checked={privacy}
                            onChange={(e) => setPrivacy(e.target.checked)}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[#ffb524]"
                          />
                          <span className="text-[0.85rem] leading-relaxed text-mist-300">
                            Acepto la política de privacidad y las condiciones del servicio. Usaremos
                            estos datos solo para gestionar la recogida y la entrega.
                          </span>
                        </label>
                        {errors.privacy && (
                          <p className="-mt-2 flex items-center gap-1.5 text-[0.78rem] font-medium text-flare-400" role="alert">
                            <Icon name="alert" className="h-3.5 w-3.5" strokeWidth={2} />
                            {errors.privacy}
                          </p>
                        )}

                        <div className="flex items-start gap-3 rounded-2xl border border-cobalt-500/25 bg-cobalt-700/10 p-4">
                          <Icon name="euro" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt-300" />
                          <p className="text-[0.83rem] leading-relaxed text-mist-300">
                            Al confirmar te llevaremos a un pago seguro (tarjeta o Bizum) por{" "}
                            <strong className="font-semibold text-bone-100">{eur(price.gross)}</strong>{" "}
                            (IVA incluido). La recogida se confirma al completar el pago.
                          </p>
                        </div>

                        {payError && (
                          <p
                            className="flex items-center gap-1.5 text-[0.82rem] font-medium text-flare-400"
                            role="alert"
                          >
                            <Icon name="alert" className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                            {payError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-mist-400/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-mist-400/20 px-5 py-3 text-[0.88rem] font-semibold text-mist-300 transition-colors hover:border-mist-400/45 hover:text-bone-50"
                      >
                        <Icon name="chevronLeft" className="h-4 w-4" />
                        Atrás
                      </button>
                    ) : (
                      <a
                        href={`tel:+34${BRAND.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center justify-center gap-2 text-[0.88rem] font-semibold text-mist-400 transition-colors hover:text-signal-400"
                      >
                        <Icon name="phone" className="h-4 w-4" />
                        Prefiero llamar
                      </a>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-sheen group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-signal-400 via-signal-500 to-signal-600 px-7 py-4 font-display text-[0.98rem] font-bold text-ink-950 shadow-[0_16px_40px_-16px_rgba(255,181,36,0.95)] transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                    >
                      {sending ? (
                        <>
                          <span
                            className="h-4 w-4 rounded-full border-2 border-ink-950/30 border-t-ink-950"
                            style={{ animation: "spin-slow 0.7s linear infinite" }}
                          />
                          Redirigiendo al pago…
                        </>
                      ) : (
                        <>
                          {step === 3 ? `Pagar y pedir recogida · ${eur(price.gross)}` : "Continuar"}
                          <Icon
                            name="arrowRight"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            strokeWidth={2.4}
                          />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <aside className="border-t border-mist-400/12 bg-ink-950/50 p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mist-500">
                    Tu presupuesto
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p
                      key={price.total}
                      className="font-display text-[2.6rem] font-extrabold leading-none text-bone-50 tabular animate-[pop-in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
                    >
                      {eur(price.total)}
                    </p>
                    <span className="pb-1 text-[0.78rem] text-mist-500">+ {eur(price.vat)} IVA</span>
                  </div>

                  <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-signal-500/25 bg-signal-500/10 px-3.5 py-3">
                    <Icon name="clock" className="h-4.5 w-4.5 shrink-0 text-signal-400" />
                    <p className="text-[0.85rem] text-mist-300">
                      Trayecto estimado{" "}
                      <strong className="font-semibold text-bone-50">≈ {formatEta(price.etaMin)}</strong>{" "}
                      · orientativo
                    </p>
                  </div>

                  <dl className="mt-5 space-y-2 text-[0.84rem]">
                    <div className="flex justify-between gap-3">
                      <dt className="text-mist-400">Servicio {serviceName}</dt>
                      <dd className="font-mono text-bone-100">{eur(price.base)}</dd>
                    </div>
                    {price.lines.map((l) => (
                      <div key={l.label} className="flex justify-between gap-3">
                        <dt className="min-w-0 truncate text-mist-400">{l.label}</dt>
                        <dd className="shrink-0 font-mono text-bone-100">{eur(l.amount)}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 border-t border-mist-400/10 pt-2 text-[0.95rem] font-bold">
                      <dt className="text-bone-50">Total con IVA</dt>
                      <dd className="font-mono text-bone-50">{eur(price.gross)}</dd>
                    </div>
                  </dl>

                  <ul className="mt-6 space-y-2.5 border-t border-mist-400/10 pt-5">
                    {[
                      `Recogida en ${cityLabel(quote.city)} lo antes posible`,
                      `${num(quote.distanceKm)} km · ${num(quote.weightKg)} kg · sin escalas`,
                      "Pago al pedir la recogida, sin cuotas",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-[0.82rem] text-mist-400">
                        <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-400" strokeWidth={3} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
