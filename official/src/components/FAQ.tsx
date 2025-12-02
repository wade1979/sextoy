'use client';

import { useState } from 'react';
import Image from 'next/image';
import { svgIcons } from '@/lib/images';

interface FAQItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const faqItems: FAQItem[] = [
  {
    question: 'Is my purchase private and discreet?',
    answer:
      "Yes, absolutely. We understand the importance of privacy. All orders are shipped in plain, unmarked packaging with no indication of the contents. The package will not display our company name or any product descriptions on the outside. Your billing statement will also show a discrete company name.",
    defaultOpen: true,
  },
  {
    question: 'What information do you collect about me?',
    answer: 'We only collect information necessary to process your order and provide customer support.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within the continental United States.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide.',
  },
  {
    question: 'Can ltrack my order?',
    answer: 'Yes, once your order ships, you will receive an email with a tracking number.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-16 md:py-[120px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[120px]">
          {/* Left: Title */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl lg:text-[64px] leading-normal text-white font-normal tracking-[-1.28px] max-w-[538px]">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Right: FAQ List */}
          <div className="flex-1 max-w-full lg:max-w-[827px]">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`border-b border-white ${
                  openIndex === index
                    ? 'bg-white/11 rounded-[4px] mb-4'
                    : 'mb-0'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <p
                    className={`text-[18px] leading-[24px] font-black ${
                      openIndex === index ? 'text-white/60' : 'text-white/60'
                    }`}
                  >
                    {item.question}
                  </p>
                  <div className="relative w-[39px] h-[39px] flex-shrink-0">
                    {openIndex === index ? (
                      <Image
                        src={svgIcons.group18}
                        alt="Close"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/15 rounded-full flex items-center justify-center">
                        <Image
                          src={svgIcons.frame}
                          alt="Open"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[14px] leading-[24px] text-white/60 font-normal">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

