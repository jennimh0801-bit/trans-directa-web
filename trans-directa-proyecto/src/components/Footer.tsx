import { useEffect, useState } from "react";
import { BRAND, COVERAGE, EXCLUDED_GOODS, FOOTER_LINKS } from "@/lib/data";
import { scrollToId } from "@/lib/store";
import { Icon, Logo } from "./Icons";
import { Button, Reveal } from "./ui";

const LEGAL: Record<string, { title: string; body: string[] }> = {
  aviso: {
    title: "Aviso legal",
    body: [
      `Titular del sitio: Trans Directa — [razón social completa], NIF [pendiente de indicar]. Domicilio: [dirección], Catalunya. Contacto: ${BRAND.email} · ${BRAND.phone}.`,
      "Trans Directa presta servicios de transporte urgente de paquetería en coche dentro de Catalunya. Los precios mostrados son orientativos hasta la confirmación de la recogida e incluyen los conceptos detallados en el presupuesto, con el IVA desglosado. El pago se realiza en el momento de pedir la recogida.",
      EXCLUDED_GOODS,
    ],
  },
  privacidad: {
    title: "Privacidad",
    body: [
      "Tratamos los datos que nos facilitas con la única finalidad de gestionar la recogida, la entrega y la facturación del servicio. La base jurídica es la ejecución del contrato.",
      "Conservamos los datos de cada envío durante el tiempo exigido por la normativa aplicable. No cedemos datos a terceros salvo obligación legal.",
      `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${BRAND.email}. También puedes reclamar ante la autoridad de protección de datos competente.`,
    ],
  },
  cookies: {
    title: "Cookies",
    body: [
      "Esta página utiliza únicamente almacenamiento técnico necesario para recordar tu presupuesto mientras navegas. No usamos cookies publicitarias ni de perfilado de terceros.",
      "Puedes borrar el almacenamiento local desde la configuración de tu navegador en cualquier momento sin perder funcionalidad.",
    ],
  },
};

function LegalDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [id, onClose]);

  if (!id) return null;
  const doc = LEGAL[id];

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        className="glass relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-[26px] p-7 sm:p-9"
        style={{ animation: "pop-in 0.35s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="flex items-start justify-between gap-6">
          <h2 className="font-display text-2xl font-bold text-bone-50">{doc.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            autoFocus
            className="rounded-full border border-mist-400/20 p-2 text-mist-300 transition-colors hover:border-signal-500/50 hover:text-signal-400"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {doc.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-[0.92rem] leading-relaxed text-mist-300">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [legal, setLegal] = useState<string | null>(null);

  return (
    <footer className="relative overflow-hidden border-t border-mist-400/10 bg-ink-950 pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-mist-400">
              Mensajería urgente en coche para empresas en Catalunya. Un coche híbrido, trayecto
              directo sin escalas y pago por envío, sin planes ni cuotas.
            </p>
            <Button className="mt-7" icon="arrowRight" onClick={() => scrollToId("reservar")}>
              Pedir presupuesto
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((col, i) => (
              <Reveal key={col.title} delay={i * 70}>
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-signal-500">
                    {col.title}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <button
                          type="button"
                          onClick={() => scrollToId(l.to)}
                          className="group inline-flex items-center gap-1.5 text-left text-[0.88rem] text-mist-400 transition-colors duration-300 hover:text-bone-50"
                        >
                          {l.label}
                          <Icon
                            name="arrowUpRight"
                            className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal delay={140} className="col-span-2 sm:col-span-1">
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-signal-500">
                  Contacto
                </p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href={`tel:+34${BRAND.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2.5 text-[0.9rem] font-semibold text-bone-100 transition-colors hover:text-signal-400"
                    >
                      <Icon name="phone" className="h-4 w-4 text-signal-500" />
                      {BRAND.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="inline-flex items-center gap-2.5 break-all text-[0.9rem] font-semibold text-bone-100 transition-colors hover:text-signal-400"
                    >
                      <Icon name="mail" className="h-4 w-4 shrink-0 text-signal-500" />
                      {BRAND.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5 text-[0.88rem] text-mist-400">
                    <Icon name="pin" className="h-4 w-4 shrink-0 text-signal-500" />
                    Servicio solo en Catalunya
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 border-t border-mist-400/10 py-7">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-mist-500">
            Cobertura
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {COVERAGE.map((c) => (
              <span
                key={c}
                className="rounded-full border border-mist-400/12 px-3 py-1 text-[0.78rem] text-mist-400 transition-colors duration-300 hover:border-signal-500/40 hover:text-signal-400"
              >
                {c}
              </span>
            ))}
            <span className="rounded-full border border-signal-500/30 bg-signal-500/10 px-3 py-1 text-[0.78rem] font-semibold text-signal-400">
              y el resto de Catalunya
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-mist-400/10 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem] text-mist-500">
            <span>© {new Date().getFullYear()} Trans Directa</span>
            {Object.entries(LEGAL).map(([key, doc]) => (
              <button
                key={key}
                type="button"
                onClick={() => setLegal(key)}
                className="transition-colors hover:text-signal-400"
              >
                {doc.title}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-[0.8rem] text-mist-400">
            <Icon name="leaf" className="h-3.5 w-3.5 text-mint-400" />
            Un coche híbrido · trayecto directo
          </span>
        </div>
      </div>

      <div aria-hidden className="road-line h-[3px] w-full opacity-30" />
      <LegalDialog id={legal} onClose={() => setLegal(null)} />
    </footer>
  );
}
