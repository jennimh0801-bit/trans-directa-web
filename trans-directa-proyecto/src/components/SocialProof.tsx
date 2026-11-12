import { COVERAGE, FACTS } from "@/lib/data";
import { Icon } from "./Icons";
import { Reveal } from "./ui";

export function SocialProof() {
  const row = [...COVERAGE, ...COVERAGE];
  return (
    <section className="relative overflow-hidden border-y border-mist-400/10 bg-ink-900 py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(30,107,255,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-mist-500">
            Recogemos y entregamos en toda Catalunya
          </p>
        </Reveal>

        <div className="marquee-mask group relative mt-8 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-12 group-hover:[animation-play-state:paused] sm:gap-16">
            {row.map((place, i) => (
              <span
                key={`${place}-${i}`}
                className="flex shrink-0 items-center gap-2.5 text-mist-400/70 transition-all duration-300 hover:text-signal-400"
              >
                <Icon name="pin" className="h-4.5 w-4.5" />
                <span className="whitespace-nowrap font-display text-[1.05rem] font-semibold tracking-tight">
                  {place}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 divide-mist-400/10 rounded-3xl border border-mist-400/12 bg-ink-850/60 sm:divide-x lg:grid-cols-4">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 90}>
              <div className="group relative px-5 py-7 text-center sm:px-6">
                <p className="font-display text-[2.2rem] font-extrabold leading-none text-bone-50 tabular sm:text-[2.7rem]">
                  {fact.value}
                </p>
                <p className="mt-2.5 text-[0.9rem] font-semibold text-bone-200">{fact.label}</p>
                <p className="mt-1 text-[0.78rem] text-mist-500">{fact.sub}</p>
                <span className="absolute inset-x-6 bottom-3 h-px scale-x-0 bg-gradient-to-r from-transparent via-signal-500/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
