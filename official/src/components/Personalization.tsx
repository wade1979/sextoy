import Image from 'next/image';
import { images } from '@/lib/images';

const avatars = [
  { src: images.rectangle21, bg: '#E5DDCE' },
  { src: images.rectangle23, bg: '#CFCBDC' },
  { src: images.rectangle24, bg: '#E9DCBB' },
  { src: images.avatar, bg: '#C7D1B0' },
  { src: images.avatar1, bg: '#DDC0CE' },
  { src: images.avatar2, bg: '#E5DDCE' },
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
          <p className="text-xl md:text-3xl lg:text-[44px] leading-normal text-white text-center max-w-[1400px] font-medium px-4">
            Our adaptive AI learns your rhythm, preferences, and unique patterns — becoming more in tune with your body every time you use it. The more you explore, the more personal it becomes
          </p>

          {/* Title */}
          <h3 className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white text-center font-extralight tracking-[-0.64px]">
            Learns what you like
          </h3>
        </div>
      </div>
    </section>
  );
}

