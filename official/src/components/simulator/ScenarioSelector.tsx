'use client';

/**
 * 场景选择器组件
 */

import { Scenario } from '@/hooks/useSimulator';

interface ScenarioSelectorProps {
  value: Scenario;
  onChange: (scenario: Scenario) => void;
}

const scenarios: Scenario[] = ['Wake', 'Relax', 'Train', 'Lead', 'Care'];

const scenarioDescriptions: Record<Scenario, string> = {
  Wake: 'Gentle awakening rhythm',
  Relax: 'Calm and soothing pace',
  Train: 'Active training mode',
  Lead: 'Guided experience',
  Care: 'Tender and attentive'
};

export default function ScenarioSelector({
  value,
  onChange
}: ScenarioSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm text-white/70 mb-2">
        Scenario
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Scenario)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '12px',
          paddingRight: '2.5rem'
        }}
      >
        {scenarios.map((scenario) => (
          <option
            key={scenario}
            value={scenario}
            className="bg-[#0c0e12] text-white"
          >
            {scenario} - {scenarioDescriptions[scenario]}
          </option>
        ))}
      </select>
    </div>
  );
}

