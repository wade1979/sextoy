import Image from 'next/image';
import { images } from '@/lib/images';

export default function CTA() {
  return (
    <section className="relative w-full h-[500px] md:h-[700px] lg:h-[900px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={images.rectangle3}
            alt=""
            fill
            className="object-cover"
            style={{ transform: 'scale(1.39)' }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={images.rectangle2}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center gap-[52px]">
        <h2 className="text-3xl md:text-5xl lg:text-[64px] leading-normal text-white text-center font-normal tracking-[-1.28px] max-w-[927px] px-4">
          1,300 people{' '}
          <br />
          chose us at the same time.
        </h2>
        <button className="bg-white border-2 border-white/12 text-[#181d27] text-[18px] font-semibold px-[24px] py-[12px] rounded-[8px] hover:bg-white/90 transition-colors shadow-sm">
          Learn More
        </button>
      </div>
    </section>
  );
}

