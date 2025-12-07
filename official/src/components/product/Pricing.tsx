export default function Pricing() {
  return (
    <section id="pricing" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-8 md:mb-12 tracking-[-1.04px]">
            Pricing
          </h2>

          {/* Special Launch Price */}
          <div className="mb-12">
            <p className="text-lg md:text-xl text-white/60 mb-4">
              Special Launch Price
            </p>
            <div className="flex items-baseline justify-center gap-4 mb-2">
              <span className="text-5xl md:text-6xl lg:text-[72px] text-white font-bold">
                $69
              </span>
            </div>
            <p className="text-base text-white/60 mb-4">
              Includes taxes & discreet shipping
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl md:text-2xl text-white/40 line-through">
                $99
              </span>
              <span className="text-base text-white/60">Regular price</span>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-12 text-left">
            <h3 className="text-xl md:text-2xl text-white font-medium mb-6">
              Your purchase includes:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">The device</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">Companion app access</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">AI Rhythm Engine & Adaptive Learning</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">
                  5 AI companions included
                  <span className="text-white/60 text-sm"> (Includes 2 bonus companions during the launch offer)</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">
                  1 licensed real-performer avatar (2 years included)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">Secure pairing & privacy protection</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white text-lg mt-1">✓</span>
                <p className="text-base md:text-lg text-white">Full warranty</p>
              </div>
            </div>
          </div>

          {/* Future Options */}
          <div className="mb-12 text-left">
            <h3 className="text-xl md:text-2xl text-white/60 font-medium mb-4">
              Future options
            </h3>
            <div className="space-y-2 text-base text-white/60">
              <p>Optional additional AI companions</p>
              <p>Optional additional licensed real-performer avatars</p>
              <p>Subscription renewal after the included 2 years</p>
            </div>
          </div>

          {/* Buy Button */}
          <button className="w-full md:w-auto px-8 py-4 bg-white border-2 border-white/12 text-[#181d27] text-lg md:text-xl font-semibold rounded-[8px] hover:bg-white/90 transition-colors shadow-sm mb-4">
            Buy with Stripe
          </button>
          <p className="text-sm text-white/60">
            Secure checkout • No hidden fees • Ships discreetly
          </p>
        </div>
      </div>
    </section>
  );
}

