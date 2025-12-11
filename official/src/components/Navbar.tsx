'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-lg border-b border-white/8'
          : 'bg-black/44 backdrop-blur-lg border-b border-white/8'
      }`}
      style={{ height: '95.426px' }}
    >
      <div className="max-w-[1804px] mx-auto px-4 md:px-[36px] h-full flex items-center justify-between relative">
        {/* Left Navigation */}
        <div className="flex items-center gap-2 md:gap-[23px]">
          <div className="hidden md:flex items-center gap-4 md:gap-[36px]">
            <a
              href="#"
              className="px-[7px] py-[5px] rounded-[9px] text-white text-sm md:text-[18px] font-semibold hover:bg-white/10 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="px-[7px] py-[5px] rounded-[9px] text-white/50 text-sm md:text-[18px] font-semibold hover:bg-white/10 hover:text-white transition-colors"
            >
              Products
            </a>
            <a
              href="#"
              className="px-[7px] py-[5px] rounded-[9px] text-white/50 text-sm md:text-[18px] font-semibold hover:bg-white/10 hover:text-white transition-colors"
            >
              Ai Partner
            </a>
            <a
              href="/faq"
              className="px-[7px] py-[5px] rounded-[9px] text-white/50 text-sm md:text-[18px] font-semibold hover:bg-white/10 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>

        {/* Center Logo */}
        <p className="absolute left-1/2 -translate-x-1/2 text-white text-lg md:text-[25px] font-['Figma_Hand'] whitespace-nowrap">
          PLEASURE
        </p>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-[32px]">
          <button className="px-3 md:px-[16px] py-2 md:py-[11px] rounded-[9px] bg-transparent border border-white/12 text-white text-xs md:text-[16px] font-semibold hover:bg-white/10 transition-colors shadow-sm">
            Log in
          </button>
          <button className="px-4 md:px-[20px] py-2 md:py-[14px] rounded-[9px] bg-white text-[#181d27] text-sm md:text-[18px] font-semibold hover:bg-white/90 transition-colors shadow-sm border-2 border-white/12">
            Buy Now
          </button>
        </div>
      </div>
    </nav>
  );
}

