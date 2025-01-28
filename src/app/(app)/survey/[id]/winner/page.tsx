import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';

export default async function WinnerAnnouncementPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });
  const sortedResponses = survey.responses.sort((a, b) => {
    const timeA = differenceInSeconds(new Date(a.completed_at), new Date(a.started_at));
    const timeB = differenceInSeconds(new Date(b.completed_at), new Date(b.started_at));
    return timeA - timeB; // Sort ascending (lowest to highest)
  });

  // Winner data
  const winnerData = sortedResponses.slice(0, survey.number_of_winners).map((response, index) => {
    return {
      rank: index + 1,
      name: response.user.firstname,
      winnerRef: survey.referrals.find(r => r.referrer_id === response.user_id) || '#',
      points: response.user.points,
      giftCardValue: survey.giftCards[0]?.value ?? '£30'
    };
  });

  return (
    <main className='flex min-h-screen flex-col items-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <nav className='mb-4 flex w-full items-center justify-between md:mb-8'>
        <h1 className='text-3xl font-bold md:text-4xl'>Survey Winner Announcement</h1>
        <div className='flex items-center space-x-6'>
          <Link href={`/survey/${id}`} className='text-white underline'>
            Back to Analytics
          </Link>
          <Link href='/' className='text-white underline'>
            Home
          </Link>
        </div>
      </nav>
      <div className='m-auto flex h-full flex-col items-center rounded-lg bg-white/10 p-6 shadow-lg'>
        <h2 className='mb-4 text-3xl font-bold text-white'>The £30 giftcard winners are...</h2>
        <div className='mb-6 space-y-4'>
          {winnerData.map(winner => (
            <div key={winner.rank} className='flex flex-col items-center'>
              <h3 className='text-4xl font-bold text-white'>{winner.name}</h3>
              <p className='text-lg text-gray-300'>
                Rank: {winner.rank}, Total: {winner.points}
              </p>
              <Button className='bg-tertiary hover:bg-tertiary/90 mt-2'>Claim giftcard</Button>
            </div>
          ))}
        </div>
        <p className='mt-4 text-xs text-gray-300'>Powered by Genus</p>
      </div>
    </main>
  );
}
