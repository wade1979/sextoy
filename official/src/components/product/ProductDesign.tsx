const specs = [
  {
    category: 'Materials',
    items: [
      'Medical-grade silicone (outer chamber)',
      'Reinforced polymer structural frame',
    ],
  },
  {
    category: 'Motor',
    items: ['13.3krpm at 20V'],
  },
  {
    category: 'Motion System',
    items: [
      '10+ AI-generated rhythm modes',
      'Real-technique motion mapping engine',
    ],
  },
  {
    category: 'Noise (Max)',
    items: ['< 60 dB'],
  },
  {
    category: 'Battery',
    items: [
      'USB-C charging',
      '2000 mAh, Up to 120 minutes continuous use',
    ],
  },
  {
    category: 'Connectivity',
    items: ['WiFi'],
  },
  {
    category: 'Weight',
    items: ['805g'],
  },
  {
    category: 'Privacy',
    items: ['Fully discreet packaging'],
  },
];

export default function ProductDesign() {
  return (
    <section id="design" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            Designed with Purpose
          </h2>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-col gap-6">
            <p className="text-base md:text-lg leading-[28px] text-white/80">
              Every detail is intentional — the weight, the balance, the grip, the softness where it matters, and the structure where it counts.
            </p>
            <p className="text-base md:text-lg leading-[28px] text-white/80">
              It's engineered to disappear in your hands, leaving only the experience and the rhythm shaped by your AI companion.
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-2xl md:text-3xl lg:text-[40px] leading-normal text-white font-normal mb-8">
            Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specs.map((spec, index) => (
              <div key={index} className="flex flex-col gap-3">
                <h4 className="text-lg md:text-xl text-white font-medium">
                  {spec.category}
                </h4>
                <ul className="space-y-2">
                  {spec.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-base text-white/70"
                    >
                      <span className="text-white/40 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

