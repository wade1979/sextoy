import { Suspense } from 'react';
import SimulatorPage from '@/components/simulator/SimulatorPage';
import Navbar from '@/components/Navbar';

function SimulatorPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white/50">Loading simulator...</div>
    </div>
  );
}

export default function SimulatorRoute() {
  return (
    <main className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <Navbar />
      <div className="pt-[60px] md:pt-[155px]">
        <Suspense fallback={<SimulatorPageFallback />}>
        <SimulatorPage />
        </Suspense>
      </div>
    </main>
  );
}

