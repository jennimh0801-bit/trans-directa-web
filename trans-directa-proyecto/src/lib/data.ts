export const BRAND = {
  name: "Trans Directa",
  claim: "Paquetes urgentes en coche para empresas en Catalunya",
  phone: "640 82 93 00",
  email: "transdirecta@gmail.com",
};

export const NAV_LINKS = [
  { id: "servicio", label: "Servicio" },
  { id: "panel", label: "Seguimiento" },
  { id: "ventajas", label: "Ventajas" },
  { id: "clientes", label: "Clientes" },
  { id: "tarifas", label: "Tarifas" },
  { id: "faq", label: "FAQ" },
];

export const IMAGES = {
  heroCar:
    "https://images.pexels.com/photos/15121199/pexels-photo-15121199.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=900",
  pod:
    "https://images.pexels.com/photos/8989470/pexels-photo-8989470.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=750",
  cityNight:
    "https://images.pexels.com/photos/3148002/pexels-photo-3148002.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900",
  highway:
    "https://images.pexels.com/photos/34369698/pexels-photo-34369698.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250",
};

/* ------------------------------------------------------------------ */
/* Zona de servicio: únicamente Catalunya                              */
/* ------------------------------------------------------------------ */

export const OTHER_CITY = "Otra población de Catalunya";

export const CITIES = [
  "Barcelona",
  "L'Hospitalet de Llobregat",
  "Badalona",
  "Sabadell",
  "Terrassa",
  "Mataró",
  "Granollers",
  "Manresa",
  "Vic",
  "Girona",
  "Figueres",
  "Tarragona",
  "Reus",
  "Lleida",
  OTHER_CITY,
];

export const cityLabel = (city: string) => (city === OTHER_CITY ? "tu población" : city);

export const COVERAGE = [
  "Barcelona",
  "Girona",
  "Lleida",
  "Tarragona",
  "Sabadell",
  "Terrassa",
  "Badalona",
  "Mataró",
  "Reus",
  "Manresa",
  "Granollers",
  "Vic",
  "Figueres",
];

export const ADDRESS_HINTS: Record<string, string[]> = {
  Barcelona: [
    "Avinguda Diagonal 477, Barcelona",
    "Carrer de Balmes 89, Barcelona",
    "Passeig de Gràcia 43, Barcelona",
    "Zona Franca, Carrer A 22, Barcelona",
  ],
  Girona: ["Carrer de Santa Clara 9, Girona", "Gran Via de Jaume I 30, Girona"],
  Tarragona: ["Rambla Nova 58, Tarragona", "Polígon Francolí, Tarragona"],
  Lleida: ["Carrer Major 20, Lleida", "Polígon El Segre, Lleida"],
};

/* ------------------------------------------------------------------ */
/* Servicios y límites del paquete                                     */
/* ------------------------------------------------------------------ */

export const MAX_DISTANCE_KM = 250;
export const MAX_WEIGHT_KG = 20;
export const MAX_SIZE_LABEL = "60 × 40 × 40 cm";

export type ServiceId = "urgente" | "mismodia" | "programado";

export const SERVICES: {
  id: ServiceId;
  name: string;
  eta: string;
  desc: string;
  base: number;
  featured: boolean;
  bullets: string[];
}[] = [
  {
    id: "urgente",
    name: "Urgente",
    eta: "Lo antes posible",
    desc: "Salimos hacia tu recogida en cuanto confirmas y vamos directos al destino.",
    base: 15.9,
    featured: true,
    bullets: [
      "Salida hacia tu recogida en cuanto confirmas",
      "Trayecto directo, sin escalas",
      "Entrega lo más rápido posible",
      "Seguimiento del envío",
      "Prueba de entrega con firma",
    ],
  },
  {
    id: "mismodia",
    name: "Mismo día",
    eta: "En el día",
    desc: "Recogida y entrega dentro de la misma jornada.",
    base: 10.9,
    featured: false,
    bullets: [
      "Recogida y entrega en la misma jornada",
      "Trayecto directo al destino",
      "Seguimiento del envío",
      "Prueba de entrega con firma",
    ],
  },
  {
    id: "programado",
    name: "Programado",
    eta: "Fecha acordada",
    desc: "Reserva con antelación la recogida para el día y la hora que necesites.",
    base: 8.9,
    featured: false,
    bullets: [
      "Recogida el día y la hora que elijas",
      "Pensado para envíos previstos",
      "Trayecto directo al destino",
      "Prueba de entrega con firma",
    ],
  },
];

export type SizeId = "sobre" | "caja-s" | "caja-m";

export const SIZES: { id: SizeId; name: string; dims: string; fee: number }[] = [
  { id: "sobre", name: "Sobre / documentos", dims: "hasta 35 × 25 cm", fee: 0 },
  { id: "caja-s", name: "Caja pequeña", dims: "40 × 30 × 20 cm", fee: 0 },
  { id: "caja-m", name: "Caja mediana", dims: MAX_SIZE_LABEL, fee: 2.6 },
];

export type ExtraId = "firma" | "espera" | "devolucion";

export const EXTRAS: { id: ExtraId; name: string; desc: string; fee: number }[] = [
  { id: "firma", name: "Firma y DNI", desc: "Entrega solo al destinatario identificado", fee: 1.9 },
  { id: "espera", name: "Espera ampliada", desc: "Hasta 30 min en destino", fee: 3.2 },
  { id: "devolucion", name: "Retorno de albarán", desc: "Documento firmado de vuelta", fee: 4.5 },
];

export const ACCEPTED_GOODS = `Paquetes pequeños y medianos: documentación, repuestos, muestras comerciales, material de oficina y pedidos de tienda, hasta ${MAX_WEIGHT_KG} kg y ${MAX_SIZE_LABEL} por bulto.`;

export const EXCLUDED_GOODS =
  "No transportamos órganos ni material biológico, animales vivos, mercancías peligrosas ni artículos que requieran condiciones especiales de transporte.";

export const COMMON_GOODS = [
  "Documentación y contratos",
  "Repuestos y piezas",
  "Muestras comerciales",
  "Pedidos de tienda",
  "Material de oficina y llaves",
];

/* ------------------------------------------------------------------ */
/* Contenido de las secciones                                          */
/* ------------------------------------------------------------------ */

export const FACTS = [
  { value: "1", label: "coche híbrido", sub: "toda la atención en tu envío" },
  { value: "0", label: "escalas", sub: "del origen al destino, directo" },
  { value: "4", label: "provincias", sub: "Barcelona, Girona, Lleida y Tarragona" },
  { value: "0", label: "cuotas mensuales", sub: "pagas cada envío al pedirlo" },
];

export const FEATURES = [
  {
    icon: "route",
    title: "Trayecto directo, sin escalas",
    body:
      "Tu paquete no comparte furgoneta ni pasa por almacenes. Sale de tu puerta y va directo a la del destinatario, en un único trayecto.",
    tag: "Punto a punto",
    span: "lg",
  },
  {
    icon: "timer",
    title: "Recogida lo antes posible",
    body: "En cuanto confirmas la recogida, nos ponemos en marcha hacia tu dirección.",
    tag: "Sin esperas",
    span: "sm",
  },
  {
    icon: "bolt",
    title: "Entrega lo más rápido posible",
    body: "Una vez recogido, el paquete viaja sin paradas intermedias hasta su destino.",
    tag: "Urgente",
    span: "sm",
  },
  {
    icon: "signature",
    title: "Seguimiento y prueba de entrega",
    body: "Sabes por dónde va tu envío y recibes la confirmación de entrega con firma y foto.",
    tag: "Trazabilidad",
    span: "sm",
  },
  {
    icon: "leaf",
    title: "Un coche híbrido",
    body: "Trabajamos con un único vehículo híbrido: menos consumo y menos emisiones en cada trayecto.",
    tag: "Híbrido",
    span: "sm",
  },
  {
    icon: "euro",
    title: "Pago por envío, sin cuotas",
    body:
      "No hay planes mensuales ni permanencia. Pides presupuesto, ves el precio cerrado antes de confirmar y pagas al pedir la recogida.",
    tag: "Sin planes",
    span: "lg",
  },
];

export const BENEFITS = [
  {
    kpi: "0",
    title: "Escalas ni almacenes",
    body:
      "Tu paquete va del origen al destino en un único trayecto. No se consolida con otros envíos ni pasa por centros de clasificación.",
  },
  {
    kpi: "1",
    title: "Un coche, un envío",
    body:
      "Trabajamos con un único vehículo, así que mientras llevamos tu paquete no hay otros repartos de por medio: toda la atención está en tu entrega.",
  },
  {
    kpi: "0 €",
    title: "Cuotas y permanencia",
    body:
      "No hay planes mensuales. Conoces el precio antes de confirmar y pagas cada envío en el momento de pedir la recogida.",
  },
  {
    kpi: "4",
    title: "Provincias: toda Catalunya",
    body:
      "Recogemos y entregamos en Barcelona, Girona, Lleida y Tarragona. Un servicio de proximidad centrado en el territorio que conocemos.",
  },
];

export const COMPARISON = {
  columns: ["Trans Directa", "Mensajería convencional"],
  rows: [
    { label: "Recogida", values: ["Lo antes posible", "Según ruta de reparto"] },
    { label: "Trayecto", values: ["Directo, sin escalas", "Con paso por almacén"] },
    { label: "Entrega", values: ["Lo más rápido posible", "Habitualmente 24–48 h"] },
    { label: "Quién lleva tu paquete", values: ["Un único conductor", "Varios intermediarios"] },
    { label: "Pago", values: ["Por envío, al pedir la recogida", "Según contrato o tarifa"] },
    { label: "Cuotas o permanencia", values: ["Ninguna", "Depende del proveedor"] },
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Cuando un contrato tiene que firmarse hoy, llamamos a Trans Directa. Recogen en el despacho enseguida y el documento va directo a la notaría, sin pasar por ningún almacén.",
    name: "Marta Ferrer",
    role: "Socia directora",
    company: "Ferrer Advocats · Barcelona",
    metric: "Documentación urgente",
    avatar:
      "https://images.pexels.com/photos/33369429/pexels-photo-33369429.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
  },
  {
    quote:
      "Una máquina parada nos cuesta dinero cada hora. Pedimos la recogida del repuesto, vemos el precio antes de confirmar y el coche sale directo hacia el taller.",
    name: "Rubén Alcázar",
    role: "Responsable de mantenimiento",
    company: "Tallers Alcázar · Sabadell",
    metric: "Repuestos",
    avatar:
      "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
  },
  {
    quote:
      "Para los pedidos que un cliente necesita el mismo día nos va perfecto: no hay cuotas, pagamos solo el envío que hacemos y el trato es muy cercano.",
    name: "Elena Vargas",
    role: "Gerente",
    company: "Òptica Vargas · Girona",
    metric: "Pedidos de tienda",
    avatar:
      "https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
  },
];

export const FAQS = [
  {
    q: "¿Cuánto tarda un envío urgente?",
    a: "Recogemos lo antes posible desde que confirmas la recogida y, una vez cargado el paquete, vamos directos al destino para entregarlo lo más rápido posible. El tiempo depende de la distancia y del tráfico; al pedir presupuesto verás una estimación orientativa del trayecto.",
  },
  {
    q: "¿Qué puedo enviar?",
    a: `${ACCEPTED_GOODS} Si tienes dudas sobre un envío concreto, consúltanos antes de pedir la recogida.`,
  },
  {
    q: "¿Qué mercancías no admitís?",
    a: `${EXCLUDED_GOODS} Tampoco aceptamos bultos que superen los límites de peso y tamaño indicados.`,
  },
  {
    q: "¿Dónde operáis?",
    a: "Únicamente en Catalunya. Recogemos y entregamos en las provincias de Barcelona, Girona, Lleida y Tarragona. No realizamos envíos con origen o destino fuera de Catalunya.",
  },
  {
    q: "¿Cómo y cuándo se paga?",
    a: "No trabajamos con planes ni cuotas mensuales. Pides presupuesto, ves el precio cerrado antes de confirmar y el pago se realiza en el momento de pedir la recogida. Recibes la factura de cada envío.",
  },
  {
    q: "¿Con cuántos vehículos trabajáis?",
    a: "Con uno: un coche híbrido. Eso significa que tu paquete viaja solo, sin compartir ruta con otros envíos, y que la disponibilidad depende de los servicios en curso. Si en ese momento estamos realizando otra entrega, te indicamos cuándo podemos recoger.",
  },
  {
    q: "¿Qué pasa si el destinatario no está?",
    a: "Te avisamos de inmediato para acordar contigo cómo proceder: esperar, entregar a otra persona autorizada o devolver el paquete al origen.",
  },
  {
    q: "¿Puedo programar una recogida?",
    a: "Sí. Además del servicio urgente, puedes solicitar una entrega para el mismo día o programar la recogida para la fecha y la hora que necesites.",
  },
];

export const FOOTER_LINKS = [
  {
    title: "Servicio",
    links: [
      { label: "Urgente", to: "tarifas" },
      { label: "Mismo día", to: "tarifas" },
      { label: "Programado", to: "tarifas" },
      { label: "Cómo funciona", to: "servicio" },
    ],
  },
  {
    title: "Información",
    links: [
      { label: "Tarifas", to: "tarifas" },
      { label: "Seguimiento del envío", to: "panel" },
      { label: "Ventajas", to: "ventajas" },
      { label: "Preguntas frecuentes", to: "faq" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Envíos de ejemplo para la demostración de seguimiento               */
/* ------------------------------------------------------------------ */

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  contents: string;
  service: ServiceId;
  progress: number;
  etaMin: number;
  vehicle: string;
  speed: number;
  price: number;
  createdAt: number;
  /** El envío de ejemplo se repite en bucle para la demostración. */
  loop?: boolean;
}

export const DEMO_VEHICLE = "Coche híbrido";

export const SEED_SHIPMENTS: Shipment[] = [
  {
    id: "DX-4821",
    origin: "Despacho · Av. Diagonal 477, Barcelona",
    destination: "Notaría · Rambla Nova 58, Tarragona",
    contents: "Contratos originales · sobre",
    service: "urgente",
    progress: 0.42,
    etaMin: 95,
    vehicle: DEMO_VEHICLE,
    speed: 0.0042,
    price: 96.4,
    createdAt: Date.now() - 1000 * 60 * 38,
    loop: true,
  },
  {
    id: "DX-4820",
    origin: "Taller · Polígon Can Roqueta, Sabadell",
    destination: "Fábrica · Carrer de la Indústria 22, Terrassa",
    contents: "Repuesto · 6 kg",
    service: "urgente",
    progress: 1,
    etaMin: 28,
    vehicle: DEMO_VEHICLE,
    speed: 0.004,
    price: 28.9,
    createdAt: Date.now() - 1000 * 60 * 190,
  },
  {
    id: "DX-4819",
    origin: "Tienda · Carrer de Santa Clara 9, Girona",
    destination: "Cliente · Plaça Major 3, Vic",
    contents: "Pedido de tienda · caja pequeña",
    service: "mismodia",
    progress: 1,
    etaMin: 62,
    vehicle: DEMO_VEHICLE,
    speed: 0.004,
    price: 61.2,
    createdAt: Date.now() - 1000 * 60 * 320,
  },
];

export const STAGES = [
  { at: 0, label: "Recogida solicitada", detail: "Pago realizado y envío confirmado" },
  { at: 0.08, label: "En camino a la recogida", detail: "Nuestro coche se dirige a tu dirección" },
  { at: 0.22, label: "Paquete recogido", detail: "Bulto cargado en origen" },
  { at: 0.55, label: "En ruta directa", detail: "Sin escalas ni paradas intermedias" },
  { at: 0.92, label: "Llegando al destino", detail: "Aviso al destinatario" },
  { at: 1, label: "Entregado con firma", detail: "Prueba de entrega disponible" },
];
