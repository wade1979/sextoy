export default function Warranty() {
  return (
    <section id="warranty" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-8 tracking-[-1.04px] text-center">
            Warranty & Guarantee
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <p className="text-base md:text-lg text-white font-medium">
                1-year hardware warranty
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <p className="text-base md:text-lg text-white font-medium">
                Free replacement for manufacturing defects
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <p className="text-base md:text-lg text-white font-medium">
                Dedicated customer support
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <p className="text-base md:text-lg text-white font-medium">
                Secure handling of all warranty claims
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white text-xl mt-1">✓</span>
              <p className="text-base md:text-lg text-white font-medium">
                Clear step-by-step assistance for setup & troubleshooting
              </p>
            </div>
          </div>

          <p className="text-base text-white/60 mb-4">
            Warranty does not cover damage caused by misuse, unauthorized modifications, or non-standard accessories.
          </p>

          <p className="text-base text-white/60 text-center">
            For detailed warranty terms and troubleshooting guides, please visit the FAQ.
          </p>
        </div>
      </div>
    </section>
  );
}

