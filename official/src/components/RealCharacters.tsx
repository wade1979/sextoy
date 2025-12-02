import Image from 'next/image';
import { images, svgIcons } from '@/lib/images';

export default function RealCharacters() {
  const characters = [
    {
      name: 'Barbara',
      image: images.rectangle23,
      overlay: images.rectangle24,
      description: "A yacht won't surprise me—its gleaming hull slicing through turquoise waves, champagne chilling in ...",
    },
    {
      name: 'Daisy',
      image: images.rectangle25,
      blurred: true,
    },
    {
      name: 'Lexie',
      image: images.rectangle23,
      blurred: true,
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-[120px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* Title */}
        <div className="text-center mb-12 md:mb-[60px]">
          <h2 className="text-2xl md:text-4xl lg:text-[52px] leading-tight md:leading-[78px] text-white font-normal mb-6 tracking-[-1.04px] max-w-[1045px] mx-auto">
            Authorization of Real Characters AI Avatar of Real Characters
          </h2>
          <div className="flex items-center justify-center gap-2">
            <p className="text-[24px] text-white font-normal">Explore</p>
            <Image
              src={svgIcons.vector1}
              alt="Arrow"
              width={25}
              height={13}
              className="inline-block"
            />
            <Image
              src={svgIcons.line1}
              alt="Line"
              width={127}
              height={1}
              className="inline-block"
            />
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {characters.map((character, index) => (
            <div
              key={index}
              className={`relative h-[400px] md:h-[600px] lg:h-[900px] ${
                character.blurred ? 'opacity-20 blur-[2px]' : ''
              }`}
            >
              <div className="absolute inset-0 border border-black">
                {character.blurred ? (
                  <div className="absolute inset-0 bg-[#d9d9d9]">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={character.image}
                        alt={character.name}
                        fill
                        className="object-cover"
                        style={{ transform: 'scale(1.22)' }}
                      />
                    </div>
                    {character.overlay && (
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={character.overlay}
                          alt=""
                          fill
                          className="object-cover"
                          style={{ transform: 'scale(1.16)' }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {!character.blurred && (
                <div className="absolute bottom-0 left-0 right-0 p-[43px]">
                  <h3 className="text-[32px] text-white font-medium mb-4 tracking-[-0.64px]">
                    {character.name}
                  </h3>
                  {character.description && (
                    <p className="text-[24px] leading-[38.4px] text-white/60 max-w-[587px]">
                      {character.description}
                    </p>
                  )}
                </div>
              )}

              {character.blurred && (
                <h3 className="absolute top-[421px] left-1/2 -translate-x-1/2 text-[48px] text-white font-medium tracking-[-0.96px] whitespace-nowrap">
                  {character.name}
                </h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

