import SimulatorPage from '@/components/simulator/SimulatorPage';
import Navbar from '@/components/Navbar';

export default function SimulatorRoute() {
  return (
    <main className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <Navbar />
      <div className="pt-[60px] md:pt-[155px]">
        <SimulatorPage />
      </div>
    </main>
  );
}

