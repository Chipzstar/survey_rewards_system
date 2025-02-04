import QRCode from 'react-qr-code';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { genPasscode, genUserId } from '~/lib/utils';
import { SurveyLink } from '~/app/(app)/survey/[id]/share/survey-link';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  const user_id = genUserId();
  const passcode = genPasscode();
  const start_time = new Date().getTime();

  const surveyLink = `${survey.link}?id=${id}&start_time=${start_time}&user_id=${user_id}&passcode=${passcode}`;

  return (
    <HydrateClient>
      <div className='py-12 text-white md:my-auto'>
        <div className='flex flex-col items-center space-y-6'>
          <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>
            🎉 Scan NOW! The Fastest win the MOST QR Points! 🏆
          </h2>
          <div className='mb-4 md:mb-8'>
            <QRCode
              value={surveyLink}
              size={256}
              className='sm:max-w-2xl'
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </div>
          <SurveyLink href={surveyLink} surveyLink={survey.link} />
        </div>
      </div>
    </HydrateClient>
  );
}
