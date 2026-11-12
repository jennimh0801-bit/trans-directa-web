import {
  EXTRAS,
  SERVICES,
  SIZES,
  type ExtraId,
  type ServiceId,
  type SizeId,
} from "./data";

export interface QuoteInput {
  city: string;
  distanceKm: number;
  service: ServiceId;
  size: SizeId;
  weightKg: number;
  extras: ExtraId[];
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  base: number;
  lines: QuoteLine[];
  total: number;
  vat: number;
  gross: number;
  /** Estimación orientativa del trayecto en coche, en minutos. */
  etaMin: number;
}

export const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export const num = (n: number, decimals = 0) =>
  new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

const round = (n: number) => Math.round(n * 100) / 100;

/** Kilómetros incluidos en la tarifa base. */
export const INCLUDED_KM = 5;

export function distanceCost(km: number) {
  if (km <= INCLUDED_KM) return 0;
  const mid = Math.min(km, 25) - INCLUDED_KM;
  const far = Math.max(0, km - 25);
  return mid * 1.18 + far * 0.86;
}

export function weightCost(kg: number) {
  if (kg <= 5) return 0;
  if (kg <= 12) return 3.5;
  return 7.9;
}

/** Tiempo de conducción aproximado según la distancia (no es un compromiso de entrega). */
export function driveMinutes(km: number) {
  return Math.round(10 + km * 0.72 + Math.min(km, 15) * 0.9);
}

export function computeQuote(input: QuoteInput): Quote {
  const service = SERVICES.find((s) => s.id === input.service) ?? SERVICES[0];
  const size = SIZES.find((s) => s.id === input.size) ?? SIZES[0];
  const base = service.base;
  const lines: QuoteLine[] = [];

  const km = distanceCost(input.distanceKm);
  if (km > 0) lines.push({ label: `Distancia · ${num(input.distanceKm)} km`, amount: round(km) });

  const kg = weightCost(input.weightKg);
  if (kg > 0) lines.push({ label: `Peso · ${num(input.weightKg)} kg`, amount: round(kg) });

  if (size.fee > 0) lines.push({ label: `Tamaño · ${size.name}`, amount: size.fee });

  for (const id of input.extras) {
    const extra = EXTRAS.find((e) => e.id === id);
    if (extra) lines.push({ label: extra.name, amount: extra.fee });
  }

  const total = round(base + lines.reduce((sum, l) => sum + l.amount, 0));
  const vat = round(total * 0.21);

  return {
    base,
    lines,
    total,
    vat,
    gross: round(total + vat),
    etaMin: driveMinutes(input.distanceKm),
  };
}

export function formatEta(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
