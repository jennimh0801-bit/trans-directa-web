// Netlify Function: calcula los km reales en coche entre recogida y entrega.
const { routeDistance, DistanceError } = require("../lib/distance.cjs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON inválido." }) };
  }
  try {
    const result = await routeDistance(data);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    if (err instanceof DistanceError) {
      return { statusCode: 422, body: JSON.stringify({ error: err.message }) };
    }
    console.error("Error calculando distancia:", err);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "No hemos podido calcular la distancia. Inténtalo de nuevo." }),
    };
  }
};
