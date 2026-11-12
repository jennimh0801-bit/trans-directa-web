import { BRAND } from "@/lib/data";

function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.096 3 3.47 8.625 3.47 15.533c0 2.24.587 4.43 1.703 6.36L3 29l7.27-2.118a12.46 12.46 0 0 0 5.73 1.4h.005c6.907 0 12.533-5.625 12.533-12.533C28.538 8.84 22.912 3 16.004 3Zm0 22.86h-.004a10.37 10.37 0 0 1-5.284-1.448l-.379-.225-3.93 1.145 1.05-3.832-.247-.393a10.33 10.33 0 0 1-1.586-5.474c0-5.72 4.655-10.374 10.384-10.374 2.772 0 5.38 1.08 7.34 3.042a10.31 10.31 0 0 1 3.04 7.337c0 5.72-4.656 10.222-10.384 10.222Zm5.686-7.71c-.311-.156-1.84-.908-2.126-1.012-.285-.104-.493-.156-.7.156-.208.312-.805 1.012-.987 1.22-.182.208-.364.234-.675.078-.311-.156-1.314-.484-2.503-1.544-.925-.825-1.55-1.844-1.732-2.156-.182-.312-.02-.48.137-.636.14-.14.311-.364.467-.546.156-.182.208-.312.311-.52.104-.208.052-.39-.026-.546-.078-.156-.7-1.69-.96-2.314-.253-.608-.51-.526-.7-.536-.182-.008-.39-.01-.598-.01-.208 0-.546.078-.831.39-.285.312-1.09 1.066-1.09 2.6 0 1.534 1.116 3.016 1.271 3.224.156.208 2.196 3.355 5.323 4.703.744.321 1.324.513 1.776.656.746.237 1.425.204 1.962.124.598-.09 1.84-.753 2.1-1.48.26-.728.26-1.352.182-1.482-.078-.13-.285-.208-.597-.364Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const digits = BRAND.phone.replace(/\s/g, "");
  const message = encodeURIComponent(
    "Hola, necesito un presupuesto para un envío urgente con Trans Directa."
  );
  return (
    <a
      href={`https://wa.me/34${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 left-5 z-[105] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.75)] transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:left-6"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
