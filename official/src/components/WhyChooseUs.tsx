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
                  Adaptive Rhythm Engine — 10+ Dynamic Patterns
                </h4>
                <div className="text-[16px] leading-[24px] text-white/80">
                  <p className="mb-0">Our adaptive rhythm engine is trained on real human motion through advanced imitation learning.</p>
                  <p>With 15 dynamic modes, it interprets your pace and responds with fluid, lifelike motion — constantly adjusting to your intensity, desire, and rhythm in real time.</p>
                </div>
              </div>
            </div>

            {/* Other Features */}
            <div className="flex gap-[24px] items-center">
              <div className="bg-[#d9d9d9]/40 w-[2px] h-[50px] flex-shrink-0" />
              <p className="text-[24px] leading-normal text-white font-normal tracking-[-0.48px]">
                Personalized Growth System — AI Preference Learning
              </p>
            </div>
            <div className="flex gap-[24px] items-center">
              <div className="bg-[#d9d9d9]/40 w-[2px] h-[50px] flex-shrink-0" />
              <p className="text-[24px] leading-normal text-white font-normal tracking-[-0.48px]">
                AI Companion — 25+ Experiences(AI Characters, Realistic Digital Clones)
              </p>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="flex-1 w-full lg:w-auto h-[400px] md:h-[600px] lg:h-[761px] relative">
            <div className="absolute inset-0">
              <Image
                src={images.rectangle3}
                alt="AI-Powered Product"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={images.rectangle27}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ transform: 'scale(1.24)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

