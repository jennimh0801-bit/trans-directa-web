import { Benefits } from "@/components/Benefits";
import { Booking } from "@/components/Booking";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Pricing } from "@/components/Pricing";
import { Showcase } from "@/components/Showcase";
import { SocialProof } from "@/components/SocialProof";
import { Testimonials } from "@/components/Testimonials";
import { BackToTop, Toasts } from "@/components/Toasts";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StoreProvider } from "@/lib/store";

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-ink-950 font-sans text-bone-100">
        <Nav />
        <main>
          <Hero />
          <SocialProof />
          <Features />
          <Showcase />
          <Benefits />
          <Testimonials />
          <Pricing />
          <Faq />
          <Booking />
        </main>
        <Footer />
        <Toasts />
        <BackToTop />
        <WhatsAppButton />
      </div>
    </StoreProvider>
  );
}