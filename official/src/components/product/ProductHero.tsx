import Image from 'next/image';

export default function ProductHero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden pb-12 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e12] via-[#0c0e12] to-[#1a1d24]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,34,255,0.1),transparent_70%)]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-6 md:gap-8">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] leading-[1.1] text-white font-semibold">
              The future of personal pleasure, powered by adaptive AI.
            </h1>
            <p className="text-lg md:text-xl lg:text-[24px] leading-[32px] text-white/80 max-w-[600px]">
              Powered by an adaptive AI rhythm system, real human technique simulation, and personalized preference learning — delivering a deeply tailored experience that evolves with every use.
            </p>
            
            {/* Key Points */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                <p className="text-base md:text-lg text-white/70">
                  10+ adaptive rhythm modes powered by machine learning
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                <p className="text-base md:text-lg text-white/70">
                  AI preference learning for personalized evolution
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                <p className="text-base md:text-lg text-white/70">
                  Real-time interaction with AI companions
                </p>
              </div>
            </div>

            <button className="mt-4 bg-white border-2 border-white/12 text-[#181d27] text-base md:text-[18px] font-semibold px-[24px] py-[12px] rounded-[8px] hover:bg-white/90 transition-colors shadow-sm w-fit">
              Buy Now
            </button>
          </div>

          {/* Right: Product Image */}
          <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src="/assets/images/product-hero.png"
                alt="Product"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

