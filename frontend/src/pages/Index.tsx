import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { DomainCards } from '@/components/DomainCards';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DomainCards />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
