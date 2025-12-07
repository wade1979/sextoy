import Navbar from '@/components/Navbar';
import ProductNavbar from '@/components/product/ProductNavbar';
import ProductHero from '@/components/product/ProductHero';
import AIRhythmEngine from '@/components/product/AIRhythmEngine';
import AdaptiveLearning from '@/components/product/AdaptiveLearning';
import AICompanions from '@/components/product/AICompanions';
import ProductDesign from '@/components/product/ProductDesign';
import HowItWorks from '@/components/product/HowItWorks';
import PrivacySafety from '@/components/product/PrivacySafety';
import ShippingPackaging from '@/components/product/ShippingPackaging';
import Warranty from '@/components/product/Warranty';
import Pricing from '@/components/product/Pricing';
import Footer from '@/components/Footer';

export default function ProductPage() {
  return (
    <main className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <Navbar />
      <ProductNavbar />
      <div className="pt-[60px] md:pt-[155px]">
        <ProductHero />
        <AIRhythmEngine />
        <AdaptiveLearning />
        <AICompanions />
        <ProductDesign />
        <HowItWorks />
        <PrivacySafety />
        <ShippingPackaging />
        <Warranty />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}

