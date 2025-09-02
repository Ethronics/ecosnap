import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { DomainCards } from "@/components/DomainCards";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { FAQs } from "@/components/FAQs";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DomainCards />
      <Features />
      <Pricing />
      <DashboardPreview />
      <Testimonials />
      <FAQs />
      <Footer />
    </div>
  );
};

export default Index;
