'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const aiCompanions = [
  {
    name: 'Serena',
    role: 'Nurse',
    description: 'Gentle, attentive, and soothing — she guides you with care and calm rhythm.',
    image: '/assets/images/companion-serena.png',
  },
  {
    name: 'Victoria',
    role: 'Therapist',
    description: 'Confident, composed, and in control — she leads the tempo with precision.',
    image: '/assets/images/companion-victoria.jpg',
  },
  {
    name: 'Maya',
    role: 'Fitness Coach',
    description: 'Energetic, encouraging, and playful — she keeps your rhythm active and engaging',
    image: '/assets/images/companion-maya.jpg',
  },
];

const realCharacters = [
  {
    name: 'Tsubasa Mai',
    description: 'Tsubasa Mai (born May 8, 1999) is a Japanese AV actress affiliated with Eightman',
    image: '/assets/images/character-tsubasa-mai.png',
    realPerson: true,
  },
];

export default function AICompanions() {
  const router = useRouter();

  const handleCompanionClick = (companionName: string) => {
    router.push(`/simulator?companion=${encodeURIComponent(companionName)}`);
  };

  return (
    <section id="companions" className="relative w-full py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-6 tracking-[-1.04px]">
            AI Companions
          </h2>
          <p className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white font-normal mb-4 max-w-[900px] mx-auto">
            Adaptive personalities — virtual or real — that shape your rhythm and evolve with your preferences.
          </p>
        </div>

        {/* Block A - AI-Generated Personas */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl lg:text-[40px] leading-normal text-white font-normal mb-8">
            AI-Generated Personas
          </h3>
          <p className="text-base md:text-lg leading-[28px] text-white/80 mb-8 max-w-[800px]">
            Our AI companions come with distinct personalities, rhythm behaviors, and interaction styles.
            Each one influences the AI Rhythm Engine differently, creating expressive experiences tailored to your preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {aiCompanions.map((companion, index) => (
              <div
                key={index}
                onClick={() => handleCompanionClick(companion.name)}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="relative w-full overflow-hidden bg-white/5">
                  <Image
                    src={companion.image}
                    alt={companion.name}
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl md:text-2xl text-white font-medium mb-2">
                    {companion.name}
                  </h4>
                  <p className="text-sm text-white/60 mb-4">{companion.role}</p>
                  <p className="text-base text-white/70 leading-[24px]">
                    {companion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block B - Real Character Avatars */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-[40px] leading-normal text-white font-normal mb-8">
            Real Character Avatars
          </h3>
          <p className="text-base md:text-lg leading-[28px] text-white/80 mb-6 max-w-[800px]">
            Alongside our virtual companions, we collaborate with real professional partners who grant full authorization for creating their AI-based digital avatars.
            Their personalities and interaction styles inspire more authentic, nuanced companion experiences — built with respect, safety, and full legal clearance.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-lg border border-white/20 mb-8">
            <span className="text-white text-lg">✓</span>
            <p className="text-base md:text-lg text-white font-medium">
              Authenticated Real-Partner Avatar
            </p>
          </div>
          
          {/* Real Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {realCharacters.map((character, index) => (
              <div
                key={index}
                onClick={() => handleCompanionClick(character.name)}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="relative w-full overflow-hidden bg-white/5">
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-center mb-4">
                    <h4 className="text-xl md:text-2xl text-white font-medium">
                      {character.name}
                    </h4>
                    {character.realPerson && (
                      <div className="border border-[rgba(255,255,255,0.33)] bg-[rgba(255,255,255,0.1)] px-4 py-2">
                        <p className="text-[12px] text-white font-medium tracking-[-0.24px] uppercase">
                          REAL-PERSON
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-base text-white/70 leading-[24px]">
                    {character.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight */}
        <div className="mt-16 text-center">
          <p className="text-xl md:text-2xl lg:text-[32px] leading-normal text-white font-normal">
            Different personalities. Different rhythms. All evolving with you.
          </p>
        </div>
      </div>
    </section>
  );
}

