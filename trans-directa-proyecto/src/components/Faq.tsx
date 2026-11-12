import { useState } from "react";
import { BRAND, FAQS } from "@/lib/data";
import { scrollToId } from "@/lib/store";
import { cn } from "@/utils/cn";
import { Icon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="on-light relative overflow-hidden bg-bone-50 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(50% 40% at 10% 10%, rgba(18,179,201,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              tone="light"
              eyebrow="Preguntas"
              icon="alert"
              title={
                <>
                  Lo que nos preguntan{" "}
                  <span className="text-cobalt-600">antes de la primera recogida.</span>
                </>
              }
            />
            <Reveal delay={180}>
              <div className="mt-8 rounded-[24px] border border-ink-900/10 bg-white/80 p-6 backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-signal-400">
                  <Icon name="headset" className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-[1.1rem] font-bold text-ink-900">
                  ¿Tu caso no está aquí?
                </p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-700/75">
                  Llámanos o escríbenos y lo vemos contigo antes de pedir la recogida.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={`tel:+34${BRAND.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2.5 text-[0.92rem] font-semibold text-ink-900 transition-colors hover:text-cobalt-600"
                  >
                    <Icon name="phone" className="h-4 w-4 text-cobalt-600" />
                    {BRAND.phone}
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="inline-flex items-center gap-2.5 text-[0.92rem] font-semibold text-ink-900 transition-colors hover:text-cobalt-600"
                  >
                    <Icon name="mail" className="h-4 w-4 text-cobalt-600" />
                    {BRAND.email}
                  </a>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant="dark"
                  icon="arrowRight"
                  onClick={() => scrollToId("reservar")}
                >
                  Pedir presupuesto
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="divide-y divide-ink-900/8 border-y border-ink-900/8">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={Math.min(i, 5) * 60}>
                  <div>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-btn-${i}`}
                        className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-[1.02rem] font-semibold transition-colors duration-300 sm:text-[1.12rem]",
                            isOpen ? "text-cobalt-600" : "text-ink-900 group-hover:text-cobalt-600"
                          )}
                        >
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-400",
                            isOpen
                              ? "rotate-45 border-cobalt-600 bg-cobalt-600 text-white"
                              : "border-ink-900/15 text-ink-700 group-hover:border-cobalt-500/50"
                          )}
                        >
                          <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      aria-hidden={!isOpen}
                      className={cn(
                        "grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pr-10 text-[0.95rem] leading-relaxed text-ink-700/80">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}