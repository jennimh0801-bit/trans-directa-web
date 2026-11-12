// Cálculo de la distancia real en coche entre dos direcciones.
// Se usa tanto para mostrar el presupuesto como al crear el pago, de modo que
// el cliente nunca puede elegir los kilómetros a mano.
//
// - Si existe GOOGLE_MAPS_API_KEY en Netlify, se usa Google Maps (recomendado).
// - Si no, se usa OpenStreetMap (Nominatim + OSRM), gratuito pero pensado para
//   poco volumen y sin garantías de servicio.

const USER_AGENT = "TransDirecta/1.0 (transdirecta@gmail.com)";
const MAX_KM = 400;

// Códigos postales de Barcelona (08), Girona (17), Lleida (25) y Tarragona (43).
const CAT_POSTCODE = /\b(08|17|25|43)\d{3}\b/;
const CAT_WORDS = /(catalu[nñ]y?a|barcelona|girona|gerona|lleida|l[ée]rida|tarragona)/i;

class DistanceError extends Error {}

function looksCatalan(label) {
  return CAT_POSTCODE.test(label) || CAT_WORDS.test(label);
}

function withCity(address, city) {
  const a = String(address || "").trim();
  if (!city || /otra poblaci/i.test(city)) return a;
  return a.toLowerCase().includes(String(city).toLowerCase()) ? a : `${a}, ${city}`;
}

async function viaGoogle(origin, destination, key) {
  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", `${origin}, Catalunya, España`);
  url.searchParams.set("destinations", `${destination}, Catalunya, España`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("region", "es");
  url.searchParams.set("language", "es");
  url.searchParams.set("key", key);

  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK") {
    console.error("Google Distance Matrix:", data.status, data.error_message);
    throw new Error("Servicio de mapas no disponible.");
  }
  const el = data.rows?.[0]?.elements?.[0];
  if (!el || el.status !== "OK") {
    throw new DistanceError(
      "No encontramos una de las direcciones. Revisa calle, número y población."
    );
  }
  return {
    meters: el.distance.value,
    originLabel: data.origin_addresses[0],
    destinationLabel: data.destination_addresses[0],
    originOk: looksCatalan(data.origin_addresses[0]),
    destinationOk: looksCatalan(data.destination_addresses[0]),
  };
}

async function geocodeOSM(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "es");
  // Caja que rodea Catalunya: prioriza resultados de aquí.
  url.searchParams.set("viewbox", "0.15,42.87,3.35,40.50");
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, "Accept-Language": "es" } });
  if (!res.ok) throw new Error("Servicio de mapas no disponible.");
  const [hit] = await res.json();
  if (!hit) {
    throw new DistanceError(
      `No encontramos «${query}». Añade el número y la población.`
    );
  }
  return {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    label: hit.display_name,
    ok: hit.address?.["ISO3166-2-lvl4"] === "ES-CT" || looksCatalan(hit.display_name),
  };
}

async function viaOSM(origin, destination) {
  const a = await geocodeOSM(origin);
  const b = await geocodeOSM(destination);
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new DistanceError("No hemos podido calcular la ruta entre esas direcciones.");
  }
  return {
    meters: data.routes[0].distance,
    originLabel: a.label,
    destinationLabel: b.label,
    originOk: a.ok,
    destinationOk: b.ok,
  };
}

/**
 * Devuelve { km, originLabel, destinationLabel }.
 * Lanza DistanceError (mensaje apto para el cliente) si las direcciones no valen.
 */
async function routeDistance({ origin, destination, city }) {
  const o = withCity(origin, city);
  const d = String(destination || "").trim();
  if (o.length < 5 || d.length < 5) {
    throw new DistanceError("Indica las direcciones completas de recogida y entrega.");
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  const r = key ? await viaGoogle(o, d, key) : await viaOSM(o, d);

  if (!r.originOk) {
    throw new DistanceError("La dirección de recogida no está en Catalunya.");
  }
  if (!r.destinationOk) {
    throw new DistanceError("La dirección de entrega no está en Catalunya.");
  }

  const km = Math.max(1, Math.round(r.meters / 1000));
  if (km > MAX_KM) {
    throw new DistanceError("La ruta es demasiado larga. Llámanos y te preparamos un presupuesto.");
  }
  return { km, originLabel: r.originLabel, destinationLabel: r.destinationLabel };
}

module.exports = { routeDistance, DistanceError };
