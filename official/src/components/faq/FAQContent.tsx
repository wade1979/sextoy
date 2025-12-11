'use client';

import { useState, useEffect, useRef } from 'react';
import { FAQCategory } from '@/lib/faqData';

interface FAQContentProps {
  categories: FAQCategory[];
  onCategoryChange: (id: string | null) => void;
}

export default function FAQContent({ categories, onCategoryChange }: FAQContentProps) {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Handle URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const questionId = hash.substring(1); // Remove #
      setTimeout(() => {
        const element = document.getElementById(`question-${questionId}`);
        if (element) {
          setOpenQuestions((prev) => new Set(prev).add(questionId));
          const offsetTop = element.offsetTop - 120;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, []);

  // Intersection Observer for active category highlighting
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    let activeCategory: string | null = null;

    categories.forEach((category) => {
      const element = categoryRefs.current.get(category.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                // Only update if different to avoid unnecessary re-renders
                if (activeCategory !== category.id) {
                  activeCategory = category.id;
                  onCategoryChange(category.id);
                }
              }
            });
          },
          {
            rootMargin: '-100px 0px -50% 0px',
            threshold: [0, 0.3, 0.5, 1],
          }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [categories, onCategoryChange]);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const formatAnswer = (answer: string) => {
    // Simple markdown-like formatting
    const lines = answer.split('\n');
    return lines.map((line, index) => {
      // Bold text
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Lists
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-4 list-disc">
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^-\s*/, '') }} />
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={index} className="ml-4 list-decimal">
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s*/, '') }} />
          </li>
        );
      }
      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {categories.map((category) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          ref={(el) => {
            if (el) categoryRefs.current.set(category.id, el);
          }}
          className="scroll-mt-[120px]"
        >
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-2">
              <span className="text-white/40 text-lg md:text-xl mr-2">{category.id}.</span>
              {category.title}
            </h2>
            {category.description && (
              <p className="text-white/60 text-sm md:text-base">{category.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {category.questions.map((question) => {
              const isOpen = openQuestions.has(question.id);
              return (
                <div
                  key={question.id}
                  id={`question-${question.id}`}
                  className={`border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${
                    isOpen ? 'bg-white/5 shadow-lg' : 'bg-white/2'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full text-left px-4 md:px-6 py-4 md:py-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors touch-manipulation"
                    aria-expanded={isOpen}
                    aria-controls={`answer-${question.id}`}
                  >
                    <span className="text-white/90 text-base md:text-lg font-medium flex-1">
                      <span className="text-white/40 text-sm mr-2">{question.id}</span>
                      {question.question}
                    </span>
                    <span
                      className={`text-white/60 text-2xl font-light transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div
                    id={`answer-${question.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-5">
                      <div className="text-white/70 text-sm md:text-base leading-relaxed">
                        {formatAnswer(question.answer)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}






