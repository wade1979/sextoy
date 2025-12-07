const steps = [
  {
    title: 'Power On & Connect',
    description: 'Turn on the device and connect through the companion app for secure pairing.',
  },
  {
    title: 'Choose Your AI Companion or Mode',
    description: 'Select an AI companion or scenario mode — Wake Up, Relax, Train, Lead, or Care. Each one shapes the rhythm differently.',
  },
  {
    title: 'Let the AI Generate Your Rhythm',
    description: 'The rhythm engine adapts in real time, blending expert-trained patterns with your selected style.',
  },
  {
    title: 'It Learns You',
    description: 'With every session, the AI refines its patterns around your timing and pace, creating a more natural, personalized experience.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl text-white font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <h3 className="text-xl md:text-2xl text-white font-medium">
                {step.title}
              </h3>
              <p className="text-base text-white/70 leading-[24px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#faq"
            className="text-base md:text-lg text-white/60 hover:text-white transition-colors underline"
          >
            For more questions, please visit FAQ
          </a>
        </div>
      </div>
    </section>
  );
}

