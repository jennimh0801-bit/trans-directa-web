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

// Google: Geocoding API (encuentra la dirección) + Routes API (km en coche).
async function geocodeGoogle(query, key) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("components", "country:ES");
  // Prioriza resultados dentro de Catalunya.
  url.searchParams.set("bounds", "40.50,0.15|42.87,3.35");
  url.searchParams.set("region", "es");
  url.searchParams.set("language", "es");
  url.searchParams.set("key", key);
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === "ZERO_RESULTS" || (data.status === "OK" && !data.results?.length)) {
    throw new DistanceError(`No encontramos «${query}». Añade el número y la población.`);
  }
  if (data.status !== "OK") {
    console.error("Google Geocoding:", data.status, data.error_message);
    throw new Error("Servicio de mapas no disponible.");
  }
  const hit = data.results[0];
  const region = (hit.address_components || []).find((c) =>
    (c.types || []).includes("administrative_area_level_1")
  );
  return {
    lat: hit.geometry.location.lat,
    lng: hit.geometry.location.lng,
    label: hit.formatted_address,
    ok: region ? /^(CT|catalu)/i.test(region.short_name) || CAT_WORDS.test(region.long_name) : looksCatalan(hit.formatted_address),
  };
}

async function viaGoogle(origin, destination, key) {
  const a = await geocodeGoogle(origin, key);
  const b = await geocodeGoogle(destination, key);
  const point = (p) => ({ location: { latLng: { latitude: p.lat, longitude: p.lng } } });
  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.distanceMeters",
    },
    body: JSON.stringify({
      origin: point(a),
      destination: point(b),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Google Routes:", res.status, JSON.stringify(data));
    throw new Error("Servicio de mapas no disponible.");
  }
  const meters = data.routes?.[0]?.distanceMeters;
  if (!meters) {
    throw new DistanceError("No hemos podido calcular la ruta entre esas direcciones.");
  }
  return {
    meters,
    originLabel: a.label,
    destinationLabel: b.label,
    originOk: a.ok,
    destinationOk: b.ok,
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
