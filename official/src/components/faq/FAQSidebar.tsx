'use client';

import { FAQCategory } from '@/lib/faqData';

interface FAQSidebarProps {
  categories: FAQCategory[];
  activeCategoryId: string | null;
  onCategoryClick: (id: string) => void;
}

export default function FAQSidebar({
  categories,
  activeCategoryId,
  onCategoryClick,
}: FAQSidebarProps) {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      onCategoryClick(categoryId);
    }
  };

  return (
    <nav className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain">
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h2 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
          Categories
        </h2>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => scrollToCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  activeCategoryId === category.id
                    ? 'bg-white/20 text-white font-medium shadow-sm'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-white/40 text-xs mr-2">{category.id}.</span>
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}






