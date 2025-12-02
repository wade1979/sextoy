import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProfessionalTechnique from '@/components/ProfessionalTechnique';
import RealCharacters from '@/components/RealCharacters';
import Personalization from '@/components/Personalization';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <Navbar />
      <div className="pt-[60px] md:pt-[95px]">
        <Hero />
        <WhyChooseUs />
        <ProfessionalTechnique />
        <RealCharacters />
        <Personalization />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}

