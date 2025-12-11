'use client';

import Image from 'next/image';
import { svgIcons } from '@/lib/images';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <footer className="relative w-full bg-gradient-to-b from-transparent to-[rgba(72,83,108,0.3)] py-16 md:py-[120px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[170px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-[120px] mb-12 lg:mb-[120px]">
          {/* Left: Contact Form */}
          <div className="lg:col-span-1">
            <h3 className="text-[32px] leading-normal text-white font-medium mb-6">
              We'd Love to Hear From You
            </h3>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/23 rounded-[8px] px-[30px] py-[13px] bg-transparent text-white placeholder-white/45 text-[16px] focus:outline-none focus:border-white/50"
              />
              <textarea
                placeholder="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="border border-white/23 rounded-[8px] px-[30px] py-[13px] bg-transparent text-white placeholder-white/45 text-[16px] focus:outline-none focus:border-white/50 resize-none"
              />
              <button
                type="submit"
                className="border border-white/60 bg-white/10 text-white text-[18px] font-semibold px-[18px] py-[12px] rounded-[8px] hover:bg-white/20 transition-colors w-[178px]"
              >
                Send
              </button>
            </form>
          </div>

          {/* Middle: Links */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[120px]">
            {/* Product Links */}
            <div>
              <h4 className="text-[20px] text-white/60 font-medium mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Technology
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-[20px] text-white/60 font-medium mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/faq" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-[20px] text-white/60 font-medium mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[20px] text-white font-normal hover:text-white/80 transition-colors">
                    Shipping & Returns
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/20">
          <p className="text-[20px] text-white font-normal">
            © 2024 Al Pleasure. All rights reserved
          </p>
          <p className="text-[20px] text-white font-normal">
            18+ Only. Must be of legal age to purchase.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
              <Image src={svgIcons.xLogo} alt="X" width={24} height={24} />
            </a>
            <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
              <Image src={svgIcons.instagram} alt="Instagram" width={24} height={24} />
            </a>
            <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
              <Image src={svgIcons.youtube} alt="YouTube" width={24} height={24} />
            </a>
            <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
              <Image src={svgIcons.linkedin} alt="LinkedIn" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

