import Image from 'next/image';
import { images } from '@/lib/images';

export default function Hero() {
  return (
    <section className="relative min-h-screen md:h-[1080px] w-full overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        <Image
          src={images.rectangle1}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={images.rectangle2}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: '0% 0%' }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={images.rectangle3}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: '0% 0%', transform: 'scale(1.09)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[200px] md:top-[340px] text-center w-[90%] max-w-[829px] px-4">
        <h1 className="text-4xl md:text-6xl lg:text-[84px] leading-[99.965%] text-white font-semibold mb-4">
          Experience Pleasure
        </h1>
        <h2 className="text-4xl md:text-6xl lg:text-[84px] leading-[99.965%] text-white font-medium mb-8">
          Reimagined by Al
        </h2>
        <p className="text-base md:text-lg lg:text-[20px] leading-[30px] text-white text-center max-w-[768px] mx-auto mb-8">
          The next generation of personal wellness technology. Al-powered rhythm engine with adaptive learning and personalized experiences.
        </p>
        <button className="bg-white border-2 border-white/12 text-[#181d27] text-base md:text-[18px] font-semibold px-[18px] py-[12px] rounded-[8px] hover:bg-white/90 transition-colors shadow-sm">
          Buy Now
        </button>
      </div>
    </section>
  );
}

