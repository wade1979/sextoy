'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'rhythm-engine', label: 'AI Rhythm Engine' },
  { id: 'adaptive-learning', label: 'Adaptive Learning' },
  { id: 'companions', label: 'AI Companions' },
  { id: 'design', label: 'Design & Specs' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'privacy', label: 'Privacy & Safety' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'warranty', label: 'Warranty' },
  { id: 'pricing', label: 'Pricing' },
];

export default function ProductNavbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);

      // Find active section
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 95; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed top-[95px] left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/8 transition-all duration-300" style={{ marginTop: '0' }}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto py-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 py-2 rounded-[8px] text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

