import Image from 'next/image';
import { images } from '@/lib/images';

export default function WhyChooseUs() {
  return (
    <section className="relative w-full py-16 md:py-[120px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-12 md:mb-[80px]">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            Why choose us?
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal tracking-[-1.04px]">
            Our AI-Powered Solution
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[109px] items-start">
          {/* Left: Features List */}
          <div className="flex-1 flex flex-col gap-[44px]">
            {/* First Feature with description */}
            <div className="flex gap-[24px] items-start">
              <div className="relative w-[2px] h-[137px] flex-shrink-0">
                <div className="absolute inset-0 bg-[#d9d9d9]/40 w-[2px] h-full" />
                <div className="absolute top-0 bg-[#d9d9d9] w-[2px] h-[101px]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[24px] leading-normal text-white font-normal mb-3 tracking-[-0.48px]">
                  15+ adaptive rhythm pattern
                </h4>
                <p className="text-[16px] leading-[24px] text-white/80 font-extralight">
                  Over 15 smart grooves that instantly react to your dynamics, speed, and phrasing. Real-time fills, swing, density, and ghost notes adjust automatically—like playing with a pro drummer who reads your mind. From light brush to heavy rock, Bossa to Trap, always perfectly humanized.
                </p>
              </div>
            </div>

            {/* Other Features */}
            {[
              'AI preference learning system',
              '25+ unique experiences',
              'AI voice interaction',
              'Personalized growth system',
            ].map((feature, index) => (
              <div key={index} className="flex gap-[24px] items-center">
                <div className="bg-[#d9d9d9]/40 w-[2px] h-[50px] flex-shrink-0" />
                <p className="text-[24px] leading-normal text-white font-normal tracking-[-0.48px]">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Product Image */}
          <div className="flex-1 w-full lg:w-auto h-[400px] md:h-[600px] lg:h-[825px] relative">
            <Image
              src={images.rectangle4}
              alt="AI-Powered Product"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

