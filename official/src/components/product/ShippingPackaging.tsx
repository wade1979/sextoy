export default function ShippingPackaging() {
  return (
    <section id="shipping" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px] text-center">
            Shipping & Packaging
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 text-center">
            Your privacy matters.
            Every package ships discreetly, quickly, and securely — from our warehouse to your door.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <div>
                <p className="text-base md:text-lg text-white font-medium">
                  Discreet packaging
                </p>
                <p className="text-base text-white/60">
                  — no branding, no product identifiers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <div>
                <p className="text-base md:text-lg text-white font-medium">
                  Free worldwide shipping
                </p>
                <p className="text-base text-white/60">
                  (included in the price)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <div>
                <p className="text-base md:text-lg text-white font-medium">
                  Tracking available
                </p>
                <p className="text-base text-white/60">
                  for all orders
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <div>
                <p className="text-base md:text-lg text-white font-medium">
                  Estimated delivery
                </p>
                <p className="text-base text-white/60">
                  : 7–14 business days depending on region
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <div>
                <p className="text-base md:text-lg text-white font-medium">
                  Secure handling
                </p>
                <p className="text-base text-white/60">
                  through verified logistics partners
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-base text-white/60 text-center">
            For more details about regional delivery times, please check the FAQ.
          </p>
        </div>
      </div>
    </section>
  );
}

