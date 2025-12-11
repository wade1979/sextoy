import FAQPage from '@/components/faq/FAQPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Quick answers, setup guidance, safety notes, and troubleshooting support for your device and AI companion system.',
};

export default function FAQ() {
  return (
    <main className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <Navbar />
      <div className="pt-[60px] md:pt-[95px]">
        <FAQPage />
      </div>
      <Footer />
    </main>
  );
}






