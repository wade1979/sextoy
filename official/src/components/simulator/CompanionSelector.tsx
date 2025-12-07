'use client';

/**
 * 伴侣选择器组件
 */

import { Companion } from '@/hooks/useSimulator';

interface CompanionSelectorProps {
  value: Companion;
  onChange: (companion: Companion) => void;
}

const companions: Companion[] = ['Serena', 'Victoria', 'Maya', 'Tsubasa Mai'];

export default function CompanionSelector({
  value,
  onChange
}: CompanionSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm text-white/70 mb-2">
        AI Companion
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Companion)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '12px',
          paddingRight: '2.5rem'
        }}
      >
        {companions.map((companion) => (
          <option
            key={companion}
            value={companion}
            className="bg-[#0c0e12] text-white"
          >
            {companion}
          </option>
        ))}
      </select>
    </div>
  );
}

