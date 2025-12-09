import Image from 'next/image';

export default function AdaptiveLearning() {
  return (
    <section id="adaptive-learning" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Images */}
          <div className="relative space-y-4">
            <div className="relative w-full rounded-lg overflow-hidden bg-white/5">
              <Image
                src="/assets/images/adaptive-learning-vw8ggg4bkdrma0ctxjpsav6q68.jpg"
                alt="Adaptive AI Learning"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="relative w-full rounded-lg overflow-hidden bg-white/5">
              <Image
                src="/assets/images/adaptive-learning-76ptjs8w9hrme0ctxjp8j75njg.jpg"
                alt="Adaptive AI Learning"
                width={600}
                height={300}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal tracking-[-1.04px]">
              Adaptive AI Learning
            </h2>
            <p className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white font-normal">
              The AI observes your tempo, patterns, and reactions — gradually shaping a rhythm that feels more natural and more personal with every session.
            </p>
            <div className="space-y-4 text-base md:text-lg leading-[28px] text-white/80">
              <p>
                As you explore, the system learns what you prefer — pacing, intensity shifts, transitions, and the subtle timing that feels right for you.
              </p>
              <p>
                Over time, it builds a personalized rhythm profile that adapts and evolves.
              </p>
              <p>
                No two sessions are ever the same, and each one becomes more intuitive, more attuned, and more uniquely yours.
              </p>
            </div>
            <div className="mt-4">
              <p className="text-2xl md:text-3xl lg:text-[44px] leading-normal text-white font-light">
                It learns you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

