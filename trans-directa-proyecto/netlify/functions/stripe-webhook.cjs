// Netlify Function: Stripe llama aquí automáticamente en cuanto se completa un
// pago. Comprobamos la firma (para asegurarnos de que el aviso viene de Stripe
// de verdad) y mandamos un email a Trans Directa con los datos de la recogida.
const Stripe = require("stripe");

const NOTIFY_TO = "transdirecta@gmail.com";

async function sendNotificationEmail({ session }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Falta RESEND_API_KEY: no se puede enviar el aviso por email.");
    return;
  }

  const m = session.metadata || {};
  const gross = ((session.amount_total || 0) / 100).toFixed(2).replace(".", ",");
  const email = session.customer_details ? session.customer_details.email : session.customer_email;

  const html = `
    <h2>Nueva recogida pagada · ${gross} €</h2>
    <p><strong>Empresa:</strong> ${m.company || "-"}</p>
    <p><strong>Contacto:</strong> ${m.name || "-"} · ${m.phone || "-"} · ${email || "-"}</p>
    <p><strong>Origen:</strong> ${m.origin || "-"}</p>
    <p><strong>Destino:</strong> ${m.destination || "-"}</p>
    <p><strong>Contenido:</strong> ${m.contents || "-"}</p>
    <p><strong>Servicio:</strong> ${m.service || "-"}</p>
    <p><strong>ID de pago Stripe:</strong> ${session.id}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Trans Directa <onboarding@resend.dev>",
      to: [NOTIFY_TO],
      subject: `Nueva recogida pagada · ${m.origin || ""} → ${m.destination || ""}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend ha devuelto un error:", res.status, await res.text());
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return {
      statusCode: 500,
      body: "Faltan STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET en Netlify.",
    };
  }
  const stripe = Stripe(secretKey);

  const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return { statusCode: 400, body: `Firma no válida: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    if (session.payment_status === "paid") {
      try {
        await sendNotificationEmail({ session });
      } catch (err) {
        console.error("Error enviando el email de aviso:", err);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
