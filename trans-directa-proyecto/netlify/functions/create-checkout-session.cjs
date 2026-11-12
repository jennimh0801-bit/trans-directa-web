// Netlify Function: crea una sesión de pago de Stripe Checkout con el importe
// calculado en el SERVIDOR (nunca nos fiamos del importe que mande el navegador).
const Stripe = require("stripe");

const SERVICE_BASE = { urgente: 15.9, mismodia: 10.9, programado: 8.9 };
const SIZE_FEE = { sobre: 0, "caja-s": 0, "caja-m": 2.6 };
const EXTRA_FEE = { firma: 1.9, espera: 3.2, devolucion: 4.5 };
const INCLUDED_KM = 5;
const VAT_RATE = 0.21;

function round(n) {
  return Math.round(n * 100) / 100;
}

function distanceCost(km) {
  if (km <= INCLUDED_KM) return 0;
  const mid = Math.min(km, 25) - INCLUDED_KM;
  const far = Math.max(0, km - 25);
  return mid * 1.18 + far * 0.86;
}

function weightCost(kg) {
  if (kg <= 5) return 0;
  if (kg <= 12) return 3.5;
  return 7.9;
}

function driveMinutes(km) {
  return Math.round(10 + km * 0.72 + Math.min(km, 15) * 0.9);
}

function computeGross(input) {
  const base = SERVICE_BASE[input.service];
  const sizeFee = SIZE_FEE[input.size];
  if (base === undefined || sizeFee === undefined) {
    throw new Error("Servicio o tamaño no válidos.");
  }
  const distanceKm = Math.min(Math.max(Number(input.distanceKm) || 0, 1), 250);
  const weightKg = Math.min(Math.max(Number(input.weightKg) || 0, 1), 20);
  const extras = Array.isArray(input.extras) ? input.extras : [];

  let total = base + distanceCost(distanceKm) + weightCost(weightKg) + sizeFee;
  for (const id of extras) {
    const fee = EXTRA_FEE[id];
    if (fee !== undefined) total += fee;
  }
  total = round(total);
  const vat = round(total * VAT_RATE);
  return {
    total,
    vat,
    gross: round(total + vat),
    distanceKm,
    weightKg,
    etaMin: driveMinutes(distanceKm),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta configurar STRIPE_SECRET_KEY en Netlify." }),
    };
  }
  const stripe = Stripe(secretKey);

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON inválido." }) };
  }

  const { company, name, email, phone, origin, destination, contents, service } = data;
  if (!company || !name || !email || !phone || !origin || !destination) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan datos del formulario." }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(email))) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email no válido." }) };
  }

  let price;
  try {
    price = computeGross(data);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
  }

  const siteUrl =
    process.env.URL || `https://${event.headers.host}` || "http://localhost:8888";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_payment_methods: { enabled: true },
      locale: "es",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(price.gross * 100),
            product_data: {
              name: `Recogida Trans Directa · ${origin} → ${destination}`,
              description: `Servicio ${service || "urgente"} · ${company}`,
            },
          },
        },
      ],
      metadata: {
        company: String(company).slice(0, 200),
        name: String(name).slice(0, 200),
        phone: String(phone).slice(0, 40),
        origin: String(origin).slice(0, 300),
        destination: String(destination).slice(0, 300),
        contents: String(contents || "").slice(0, 300),
        service: String(service || "urgente"),
        gross: String(price.gross),
        etaMin: String(price.etaMin),
      },
      success_url: `${siteUrl}/?pago=ok&session_id={CHECKOUT_SESSION_ID}#reservar`,
      cancel_url: `${siteUrl}/?pago=cancelado#reservar`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error("Stripe error creating checkout session:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        param: err.param || null,
        type: err.type || null,
        code: err.code || null,
      }),
    };
  }
};
