'use client';

import { useState } from 'react';
import FAQSidebar from './FAQSidebar';
import FAQContent from './FAQContent';
import { faqCategories } from '@/lib/faqData';

export default function FAQPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen py-8 md:py-16">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[36px]">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-[64px] leading-normal text-white font-normal tracking-[-1.28px] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-3xl">
            This page provides quick answers, setup guidance, safety notes, and troubleshooting
            support for your device and AI companion system. For detailed instructions and updates,
            check back as new features become available.
          </p>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden mb-4 px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
          aria-label="Toggle categories"
        >
          <span>{isSidebarOpen ? 'Hide' : 'Show'} Categories</span>
          <span className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:block lg:flex-shrink-0 lg:w-64 transition-all duration-300`}
          >
            <FAQSidebar
              categories={faqCategories}
              activeCategoryId={activeCategoryId}
              onCategoryClick={(id) => {
                setActiveCategoryId(id);
                setIsSidebarOpen(false);
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <FAQContent
              categories={faqCategories}
              onCategoryChange={setActiveCategoryId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}






