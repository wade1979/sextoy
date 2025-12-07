import Image from 'next/image';
import { images, svgIcons } from '@/lib/images';

export default function ProfessionalTechnique() {
  return (
    <section className="relative w-full py-16 md:py-[120px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-12 md:mb-[60px]">
          <h2 className="text-2xl md:text-4xl lg:text-[52px] leading-tight md:leading-[90px] text-white font-normal mb-6 tracking-[-1.04px] max-w-[992px] mx-auto">
            Professional Technique Simulation
          </h2>
          <div className="flex items-center justify-center gap-2">
            <p className="text-[24px] text-white font-normal">Explore</p>
            <Image
              src={svgIcons.vector1}
              alt="Arrow"
              width={25}
              height={13}
              className="inline-block"
            />
            <Image
              src={svgIcons.line1}
              alt="Line"
              width={127}
              height={1}
              className="inline-block"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[55px]">
          {/* Card 1 */}
          <div className="relative h-[400px] md:h-[562px] group">
            <div className="absolute inset-0">
              <Image
                src={images.rectangle18}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[28px] bg-[rgba(0,0,0,0.72)]">
              <h3 className="text-[24px] leading-[36px] text-white font-normal mb-3">
                Pulling willows upside down
              </h3>
              <p className="text-[18px] leading-[24px] text-[rgba(255,255,255,0.6)]">
                Fingers encircle, gently and effectively promoting
              </p>
            </div>
            <div className="absolute left-1/2 top-[173px] -translate-x-1/2 w-[96px] h-[96px]">
              <Image
                src={svgIcons.frame24}
                alt="Play"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative h-[400px] md:h-[562px] group">
            <div className="absolute inset-0">
              <Image
                src={images.rectangle18}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[28px] bg-[rgba(0,0,0,0.72)]">
              <h3 className="text-[24px] leading-[36px] text-white font-normal mb-3">
                High Mountains and Flowing Water
              </h3>
              <p className="text-[18px] leading-[24px] text-[rgba(255,255,255,0.6)]">
                Gentle caresses gradually increase pleasure.
              </p>
            </div>
            <div className="absolute left-1/2 top-[173px] -translate-x-1/2 w-[96px] h-[96px]">
              <Image
                src={svgIcons.frame24}
                alt="Play"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

