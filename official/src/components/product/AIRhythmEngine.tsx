import Image from 'next/image';

export default function AIRhythmEngine() {
  return (
    <section id="rhythm-engine" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            AI Rhythm Engine
          </h2>
          <p className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white font-normal mb-4">
            Inspired by real techniques. Shaped by AI. Refined by you.
          </p>
          <p className="text-lg md:text-xl text-white/70 max-w-[800px] mx-auto">
            Real human techniques, transformed into intelligent motion.
          </p>
        </div>

        {/* Text Content */}
        <div className="max-w-[900px] mx-auto mb-8 md:mb-12">
          <div className="flex flex-col gap-6 text-center">
            <p className="text-base md:text-lg leading-[28px] text-white/80">
              Our rhythm engine is trained on over a dozen real expert techniques — capturing the subtle patterns, tempo shifts, and natural flow.
            </p>
            <p className="text-base md:text-lg leading-[28px] text-white/80">
              The AI blends these patterns with each companion's personality and scenario settings — whether it's Wake Up, Relax, Training, Lead, or Care — creating experiences that feel purposeful and immersive.
            </p>
            <p className="text-base md:text-lg leading-[28px] text-white/80">
              Each session teaches it more — always moving closer to your rhythm.
            </p>
          </div>
        </div>

        {/* Two-Stage Transformation */}
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* Stage 1: Real Techniques */}
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[400px]">
              <div className="relative w-full rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src="/assets/images/technique-real.png"
                  alt="Real Techniques"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg md:text-xl text-white font-medium mb-2">
                  Real Techniques
                </h3>
                <p className="text-sm md:text-base text-white/60">
                  Expert hand movements
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/60"
              >
                <path
                  d="M15 10L25 20L15 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Stage 2: Motion Capture */}
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[400px]">
              <div className="relative w-full rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src="/assets/images/technique-capture.png"
                  alt="Motion Capture"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg md:text-xl text-white font-medium mb-2">
                  Motion Capture
                </h3>
                <p className="text-sm md:text-base text-white/60">
                  Digitized patterns
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

