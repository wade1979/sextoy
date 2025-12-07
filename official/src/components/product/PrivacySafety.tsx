export default function PrivacySafety() {
  return (
    <section id="privacy" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            Privacy & Safety
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-[900px] mx-auto">
            We built this system to protect your privacy at every level — from how the AI learns, to how your data is handled, to how your package arrives at your door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Privacy */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl md:text-2xl text-white font-medium">
              Privacy
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Anonymous app usage</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>No identifiable data collected</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>No unauthorized likeness or deepfake generation</span>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl md:text-2xl text-white font-medium">
              Security
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Encrypted communication between device and app</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Secure storage for rhythm profiles</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Fully licensed real-character avatars</span>
              </li>
            </ul>
          </div>

          {/* Safety */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl md:text-2xl text-white font-medium">
              Safety
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Medical-grade materials</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Low-noise, temperature-controlled motor design</span>
              </li>
              <li className="flex items-start gap-2 text-base text-white/70">
                <span className="text-white/40 mt-1">•</span>
                <span>Tested for durability and long-term performance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Machine Learning */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-xl md:text-2xl text-white font-medium mb-4">
            Machine Learning
          </h3>
          <div className="space-y-3 text-base text-white/70 leading-[24px]">
            <p>
              Our adaptive AI engine learns only from rhythm-related responses — not from personal identity or private content.
            </p>
            <p>
              All preference data is anonymized and processed securely, ensuring that your experience is personal without ever compromising your privacy.
            </p>
            <p className="mt-4">
              Real-character avatars are created through formal partnerships and full usage rights.
              We never generate, store, or train on unauthorized likenesses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

