import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotion";

type Pt = { x: number; y: number };

const COLS = 9;
const ROWS = 7;

/** Ruta normalizada que sigue los ejes de la retícula urbana. */
const ROUTE: Pt[] = [
  { x: 1 / COLS, y: 6 / ROWS },
  { x: 1 / COLS, y: 4 / ROWS },
  { x: 4 / COLS, y: 4 / ROWS },
  { x: 4 / COLS, y: 2 / ROWS },
  { x: 7 / COLS, y: 2 / ROWS },
  { x: 7 / COLS, y: 3 / ROWS },
  { x: 8 / COLS, y: 3 / ROWS },
];

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundCorners(pts: Pt[], r: number): Pt[] {
  if (pts.length < 3) return pts;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    const d1 = Math.hypot(a.x - p.x, a.y - p.y);
    const d2 = Math.hypot(b.x - p.x, b.y - p.y);
    const r1 = Math.min(r, d1 / 2);
    const r2 = Math.min(r, d2 / 2);
    const s = { x: p.x + ((a.x - p.x) / d1) * r1, y: p.y + ((a.y - p.y) / d1) * r1 };
    const e = { x: p.x + ((b.x - p.x) / d2) * r2, y: p.y + ((b.y - p.y) / d2) * r2 };
    out.push(s);
    for (let t = 0.12; t < 1; t += 0.12) {
      const mt = 1 - t;
      out.push({
        x: mt * mt * s.x + 2 * mt * t * p.x + t * t * e.x,
        y: mt * mt * s.y + 2 * mt * t * p.y + t * t * e.y,
      });
    }
    out.push(e);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function drawStatic(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const rnd = mulberry(seed);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#08111a");
  bg.addColorStop(0.55, "#0a1620");
  bg.addColorStop(1, "#060d14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cw = w / COLS;
  const ch = h / ROWS;
  const road = Math.max(6, Math.min(cw, ch) * 0.2);

  // Río / diagonal de agua
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-10, h * 0.94);
  ctx.quadraticCurveTo(w * 0.34, h * 0.86, w * 0.52, h * 1.06);
  ctx.lineTo(w * 0.2, h * 1.2);
  ctx.lineTo(-10, h * 1.2);
  ctx.closePath();
  ctx.fillStyle = "#07222e";
  ctx.fill();
  ctx.restore();

  // Manzanas
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const x = i * cw + road / 2;
      const y = j * ch + road / 2;
      const bw = cw - road;
      const bh = ch - road;
      if (bw <= 2 || bh <= 2) continue;
      const r = rnd();
      const isPark = r > 0.9;
      const inset = rnd() * Math.min(bw, bh) * 0.16;
      const radius = Math.min(6, bw * 0.16);
      ctx.beginPath();
      const rx = x + inset * 0.4;
      const ry = y + inset * 0.4;
      const rw = bw - inset;
      const rh = bh - inset;
      ctx.roundRect(rx, ry, rw, rh, radius);
      if (isPark) {
        ctx.fillStyle = "rgba(16,209,137,0.10)";
      } else {
        const tone = 0.05 + rnd() * 0.07;
        ctx.fillStyle = `rgba(120,170,215,${tone.toFixed(3)})`;
      }
      ctx.fill();
      ctx.strokeStyle = isPark ? "rgba(16,209,137,0.20)" : "rgba(147,168,187,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ventanas encendidas
      if (!isPark && rnd() > 0.45) {
        const count = 2 + Math.floor(rnd() * 4);
        for (let k = 0; k < count; k++) {
          const wx = rx + 4 + rnd() * Math.max(1, rw - 8);
          const wy = ry + 4 + rnd() * Math.max(1, rh - 8);
          ctx.fillStyle = rnd() > 0.35 ? "rgba(255,181,36,0.42)" : "rgba(55,214,232,0.34)";
          ctx.fillRect(wx, wy, 1.6, 1.6);
        }
      }
    }
  }

  // Ejes viarios
  ctx.strokeStyle = "rgba(147,168,187,0.09)";
  ctx.lineWidth = road * 0.72;
  ctx.lineCap = "round";
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cw, 0);
    ctx.lineTo(i * cw, h);
    ctx.stroke();
  }
  for (let j = 0; j <= ROWS; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * ch);
    ctx.lineTo(w, j * ch);
    ctx.stroke();
  }

  // Líneas discontinuas de calzada
  ctx.setLineDash([4, 9]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,181,36,0.13)";
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cw, 0);
    ctx.lineTo(i * cw, h);
    ctx.stroke();
  }
  for (let j = 0; j <= ROWS; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * ch);
    ctx.lineTo(w, j * ch);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

export function CityMap({
  progress,
  className = "",
  seed = 11,
  delivered = false,
}: {
  progress: number;
  className?: string;
  seed?: number;
  delivered?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);
  const deliveredRef = useRef(delivered);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    progressRef.current = progress;
    deliveredRef.current = delivered;
  }, [progress, delivered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let route: Pt[] = [];
    let cum: number[] = [];
    let total = 0;
    let smooth = progressRef.current;
    let heading = -Math.PI / 2;
    let visible = true;
    const layer = document.createElement("canvas");
    const traffic = Array.from({ length: 9 }, (_, i) => ({
      axis: i % 2,
      line: 1 + ((i * 3) % (i % 2 ? ROWS - 1 : COLS - 1)),
      t: Math.random(),
      speed: 0.018 + Math.random() * 0.03,
      dir: i % 3 === 0 ? -1 : 1,
    }));

    const pointAt = (p: number) => {
      const target = Math.max(0, Math.min(1, p)) * total;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < target) i++;
      const seg = cum[i] - cum[i - 1] || 1;
      const f = (target - cum[i - 1]) / seg;
      const a = route[i - 1];
      const b = route[i];
      return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
        index: i,
      };
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(260, Math.round(rect.width));
      h = Math.max(200, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layer.width = canvas.width;
      layer.height = canvas.height;
      const lctx = layer.getContext("2d");
      if (lctx) {
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawStatic(lctx, w, h, seed);
      }
      const scaled = ROUTE.map((p) => ({ x: p.x * w, y: p.y * h }));
      route = roundCorners(scaled, Math.min(w / COLS, h / ROWS) * 0.42);
      cum = [0];
      total = 0;
      for (let i = 1; i < route.length; i++) {
        total += Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y);
        cum.push(total);
      }
    };

    const strokeRoute = (from: number, to: number) => {
      const a = pointAt(from);
      const b = pointAt(to);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      for (let i = a.index; i < b.index; i++) ctx.lineTo(route[i].x, route[i].y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(layer, 0, 0, w, h);

      const target = progressRef.current;
      // Si el envío se reinicia o cambia a otro menos avanzado, el coche salta en vez de retroceder.
      if (target < smooth - 0.25) smooth = target;
      smooth += (target - smooth) * (reduced ? 1 : 0.045);
      if (Math.abs(target - smooth) < 0.0005) smooth = target;

      // tráfico ambiental
      if (!reduced) {
        traffic.forEach((c) => {
          c.t += c.speed * 0.016 * c.dir;
          if (c.t > 1) c.t = 0;
          if (c.t < 0) c.t = 1;
          const x = c.axis === 0 ? (c.line * w) / COLS : c.t * w;
          const y = c.axis === 0 ? c.t * h : (c.line * h) / ROWS;
          ctx.beginPath();
          ctx.fillStyle = "rgba(195,209,222,0.30)";
          ctx.arc(x, y, 1.7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ruta completa
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(77,141,255,0.22)";
      ctx.lineWidth = 7;
      strokeRoute(0, 1);

      // tramo pendiente animado
      ctx.save();
      ctx.setLineDash([5, 11]);
      ctx.lineDashOffset = -t * 26;
      ctx.strokeStyle = "rgba(195,209,222,0.42)";
      ctx.lineWidth = 2;
      strokeRoute(Math.min(smooth, 0.999), 1);
      ctx.restore();

      // tramo recorrido
      const grad = ctx.createLinearGradient(0, h, w, 0);
      grad.addColorStop(0, "#1e6bff");
      grad.addColorStop(0.6, "#37d6e8");
      grad.addColorStop(1, "#ffb524");
      ctx.save();
      ctx.shadowColor = "rgba(55,214,232,0.55)";
      ctx.shadowBlur = 14;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      strokeRoute(0, Math.max(0.001, smooth));
      ctx.restore();

      const start = route[0];
      const end = route[route.length - 1];

      // origen
      const pulse = (t % 2.4) / 2.4;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,181,36,${(1 - pulse) * 0.55})`;
      ctx.lineWidth = 2;
      ctx.arc(start.x, start.y, 6 + pulse * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#ffb524";
      ctx.arc(start.x, start.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#05080b";
      ctx.arc(start.x, start.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // destino
      const dpulse = ((t + 1.2) % 2.4) / 2.4;
      const dColor = deliveredRef.current ? "16,209,137" : "75,240,172";
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${dColor},${(1 - dpulse) * 0.6})`;
      ctx.lineWidth = 2;
      ctx.arc(end.x, end.y, 6 + dpulse * 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = deliveredRef.current ? "#10d189" : "#4bf0ac";
      ctx.arc(end.x, end.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#05080b";
      ctx.arc(end.x, end.y, 2.4, 0, Math.PI * 2);
      ctx.fill();

      // coche
      const car = pointAt(smooth);
      let delta = car.angle - heading;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      heading += delta * (reduced ? 1 : 0.18);

      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(heading);
      const scale = Math.max(0.85, Math.min(1.35, w / 520));
      ctx.scale(scale, scale);

      // halo
      const halo = ctx.createRadialGradient(0, 0, 1, 0, 0, 26);
      halo.addColorStop(0, "rgba(255,181,36,0.42)");
      halo.addColorStop(1, "rgba(255,181,36,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();

      // cono de faros
      const beam = ctx.createLinearGradient(6, 0, 40, 0);
      beam.addColorStop(0, "rgba(255,236,190,0.34)");
      beam.addColorStop(1, "rgba(255,236,190,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(6, -3.4);
      ctx.lineTo(40, -12);
      ctx.lineTo(40, 12);
      ctx.lineTo(6, 3.4);
      ctx.closePath();
      ctx.fill();

      // carrocería
      ctx.beginPath();
      ctx.roundRect(-9, -5, 19, 10, 3.4);
      ctx.fillStyle = "#ffc94d";
      ctx.fill();
      ctx.strokeStyle = "rgba(5,8,11,0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-3.4, -3.6, 7, 7.2, 2);
      ctx.fillStyle = "rgba(8,17,26,0.82)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(9.4, -3, 1.3, 0, Math.PI * 2);
      ctx.arc(9.4, 3, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff6df";
      ctx.fill();
      ctx.restore();

      // viñeta
      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.78);
      vig.addColorStop(0, "rgba(5,8,11,0)");
      vig.addColorStop(1, "rgba(5,8,11,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    build();
    draw(performance.now());

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      draw(time);
    };

    let interval = 0;
    if (reduced) {
      interval = window.setInterval(() => draw(performance.now()), 600);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (interval) window.clearInterval(interval);
      ro.disconnect();
      io.disconnect();
    };
  }, [seed, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={`Mapa en vivo del envío: ${Math.round(progress * 100)} % del trayecto completado`}
    />
  );
}