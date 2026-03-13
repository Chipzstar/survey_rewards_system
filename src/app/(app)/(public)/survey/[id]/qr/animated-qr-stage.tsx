'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { SurveyLink } from '~/components/ui/survey-link';

interface AnimatedQrStageProps {
  thumbnails: string[];
  surveyId: number;
  surveyLink: string | null;
}

const THUMBNAIL_POSITIONS = [
  'top-4 left-2 md:top-2 md:left-16',
  'top-12 right-2 md:top-8 md:right-16',
  'bottom-20 left-2 md:bottom-20 md:left-20',
  'bottom-8 right-4 md:bottom-8 md:right-14',
  'top-1/3 left-0 md:top-1/3 md:left-8',
  'top-1/3 right-0 md:top-1/3 md:right-8',
  'top-1/2 -left-2 md:top-1/2 md:left-24',
  'top-1/2 -right-2 md:top-1/2 md:right-24'
];

function getFloatAnimation(index: number) {
  const driftX = index % 2 === 0 ? 20 : -20;
  const driftY = index % 3 === 0 ? -24 : 20;
  const duration = 6 + (index % 4);
  const delay = index * 0.15;

  return {
    x: [0, driftX, 0, -driftX, 0],
    y: [0, driftY, 0, -driftY, 0],
    scale: [1, 1.08, 0.96, 1.06, 1],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut' as const
    }
  };
}

export function AnimatedQrStage({ thumbnails, surveyId, surveyLink }: AnimatedQrStageProps) {
  return (
    <section className='relative flex flex-1 items-center justify-center px-4 py-10'>
      {thumbnails.length > 0 && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='relative h-[560px] w-full max-w-6xl'>
            {thumbnails.slice(0, 16).map((src, index) => {
              const positionClass = THUMBNAIL_POSITIONS[index % THUMBNAIL_POSITIONS.length];
              const sizeClass = index % 3 === 0 ? 'h-28 w-28 md:h-32 md:w-32' : 'h-24 w-24 md:h-28 md:w-28';
              const floatAnimation = getFloatAnimation(index);

              return (
                <motion.div
                  key={`${src}-${index}`}
                  className={`absolute ${positionClass}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                >
                  <motion.div
                    className='rounded-2xl bg-white/35 p-2 shadow-lg shadow-primary/25 backdrop-blur-md'
                    animate={floatAnimation}
                    style={{ willChange: 'transform' }}
                  >
                    <div className={`relative overflow-hidden rounded-xl bg-white ${sizeClass}`}>
                      <Image src={src} alt='Reward preview' fill sizes='128px' className='object-contain' />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <section className='relative z-10 flex w-full max-w-md flex-col items-center space-y-6 rounded-2xl bg-white/90 p-8 text-gray-900 shadow-xl shadow-cyan-900/15 ring-1 ring-white/40'>
        <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>🎉 Scan NOW!!! 🏆</h2>
        <SurveyLink surveyId={surveyId} surveyLink={surveyLink} />
      </section>
    </section>
  );
}
