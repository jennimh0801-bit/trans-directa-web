// Netlify Function: comprueba contra Stripe (no contra el navegador) si una
// sesión de pago se completó, y devuelve los datos de la recogida.
const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
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

  const sessionId = event.queryStringParameters && event.queryStringParameters.session_id;
  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta session_id." }) };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return { statusCode: 200, body: JSON.stringify({ paid: false }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        paid: true,
        amountTotal: session.amount_total,
        currency: session.currency,
        email: session.customer_details ? session.customer_details.email : session.customer_email,
        metadata: session.metadata,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
