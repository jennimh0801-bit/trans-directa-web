import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEMO_VEHICLE, SEED_SHIPMENTS, type Shipment } from "./data";
import { computeQuote, type QuoteInput } from "./pricing";

export interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: "mint" | "signal" | "cobalt" | "flare";
}

interface StoreValue {
  quote: QuoteInput;
  setQuote: <K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) => void;
  toggleExtra: (id: QuoteInput["extras"][number]) => void;
  shipments: Shipment[];
  activeId: string;
  setActiveId: (id: string) => void;
  active: Shipment;
  createShipment: (payload: {
    origin: string;
    destination: string;
    contents: string;
    price: number;
    etaMin: number;
  }) => string;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const DEFAULT_QUOTE: QuoteInput = {
  city: "Barcelona",
  distanceKm: 12,
  service: "urgente",
  size: "caja-s",
  weightKg: 4,
  extras: ["firma"],
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [quote, setQuoteState] = useState<QuoteInput>(DEFAULT_QUOTE);
  const [shipments, setShipments] = useState<Shipment[]>(SEED_SHIPMENTS);
  const [activeId, setActiveId] = useState(SEED_SHIPMENTS[0].id);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const shipRef = useRef(shipments);
  const toastSeq = useRef(1);
  const orderSeq = useRef(4822);
  const holdTicks = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    shipRef.current = shipments;
  }, [shipments]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = toastSeq.current++;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      const handle = window.setTimeout(() => dismissToast(id), 5600);
      timers.current.push(handle);
    },
    [dismissToast]
  );

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((h) => window.clearTimeout(h));
      list.length = 0;
    };
  }, []);

  // Un único reloj para la demostración: solo hay un coche, así que solo avanza un envío a la vez.
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      const prev = shipRef.current;
      if (!prev.some((s) => s.progress < 1 || s.loop)) return;
      const finished: Shipment[] = [];
      const next = prev.map((s) => {
        if (s.progress >= 1) {
          if (!s.loop) return s;
          // El envío de ejemplo se queda unos segundos como entregado y vuelve a empezar.
          holdTicks.current += 1;
          if (holdTicks.current < 8) return s;
          holdTicks.current = 0;
          return { ...s, progress: 0.03 };
        }
        const p = Math.min(1, s.progress + s.speed);
        const updated = { ...s, progress: p };
        if (p >= 1 && !s.loop) finished.push(updated);
        return updated;
      });
      shipRef.current = next;
      setShipments(next);
      finished.forEach((s) =>
        pushToast({
          tone: "mint",
          title: `${s.id} entregado`,
          body: "Simulación completada: entrega registrada con firma en destino.",
        })
      );
    }, 900);
    return () => window.clearInterval(interval);
  }, [pushToast]);

  const setQuote = useCallback<StoreValue["setQuote"]>((key, value) => {
    setQuoteState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleExtra = useCallback((id: QuoteInput["extras"][number]) => {
    setQuoteState((prev) => ({
      ...prev,
      extras: prev.extras.includes(id)
        ? prev.extras.filter((e) => e !== id)
        : [...prev.extras, id],
    }));
  }, []);

  const createShipment = useCallback<StoreValue["createShipment"]>(
    ({ origin, destination, contents, price, etaMin }) => {
      const id = `DX-${orderSeq.current++}`;
      const shipment: Shipment = {
        id,
        origin,
        destination,
        contents,
        service: quote.service,
        progress: 0.015,
        etaMin,
        vehicle: DEMO_VEHICLE,
        speed: 0.0135,
        price,
        createdAt: Date.now(),
      };
      // Un solo coche: los envíos de ejemplo anteriores pasan a entregados.
      const previous = shipRef.current.map((s) =>
        s.progress < 1 || s.loop ? { ...s, progress: 1, loop: false } : s
      );
      const next = [shipment, ...previous];
      shipRef.current = next;
      setShipments(next);
      setActiveId(id);
      return id;
    },
    [quote.service]
  );

  const active = useMemo(
    () => shipments.find((s) => s.id === activeId) ?? shipments[0],
    [shipments, activeId]
  );

  const value = useMemo<StoreValue>(
    () => ({
      quote,
      setQuote,
      toggleExtra,
      shipments,
      activeId,
      setActiveId,
      active,
      createShipment,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      quote,
      setQuote,
      toggleExtra,
      shipments,
      activeId,
      active,
      createShipment,
      toasts,
      pushToast,
      dismissToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

export function useQuote() {
  const { quote } = useStore();
  return useMemo(() => computeQuote(quote), [quote]);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
