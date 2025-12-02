import Image from 'next/image';
import { images } from '@/lib/images';

const avatars = [
  { src: images.avatar, bg: '#E5DDCE' },
  { src: images.avatar1, bg: '#CFCBDC' },
  { src: images.avatar2, bg: '#E9DCBB' },
  { src: images.avatar3, bg: '#C7D1B0' },
  { src: images.avatar4, bg: '#DDC0CE' },
  { src: images.avatar5, bg: '#E5DDCE' },
];

export default function Personalization() {
  return (
    <section className="relative w-full py-16 md:py-[240px] px-4 md:px-[334px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col items-center gap-8 md:gap-[88px]">
          {/* Avatars */}
          <div className="flex items-center -space-x-3 md:-space-x-6">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className="relative w-16 h-16 md:w-[106px] md:h-[106px] rounded-full border border-black/8 overflow-hidden"
                style={{ backgroundColor: avatar.bg }}
              >
                <Image
                  src={avatar.src}
                  alt={`Avatar ${index + 1}`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-xl md:text-3xl lg:text-[48px] leading-normal text-white text-center max-w-[1400px] font-normal px-4">
            Advanced machine learning algorithms analyze your usage patterns and preferences. The device becomes more personalized with each use, creating a truly unique experience.
          </p>

          {/* Title */}
          <h3 className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white text-center font-extralight tracking-[-0.64px]">
            Personalized customization
          </h3>
        </div>
      </div>
    </section>
  );
}

