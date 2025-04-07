import React from 'react';
import Container from '~/components/layout/Container';
import { HydrateClient, trpc } from '~/trpc/server';
import { Card, CardContent } from '~/components/ui/card';
import { CreateRewardDialog } from '~/components/modals/create-reward-dialog';
import { columns } from './columns';
import { format, isBefore } from 'date-fns';
import { RewardTable } from './reward-table';

export default async function RewardsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const rewards = await trpc.reward.all();

  const data =
    rewards
      .filter(r => {
        const query = searchParams?.query;
        if (!query || query.length === 0) return true;
        return r.name.toLowerCase().includes(query.toLowerCase());
      })
      .map(reward => {
        const totalClaimed = reward.responses.filter(response => response.reward_claimed).length;
        const surveyDeadline = new Date(reward.survey.end_date);
        const status = isBefore(new Date(), surveyDeadline) ? 'Active' : 'Closed';
        return {
          id: reward.id,
          name: reward.name,
          surveyId: reward.survey.id,
          surveyName: reward.survey.name,
          totalClaimed,
          status,
          date: format(reward.created_at, 'dd MMM yyyy')
        };
      }) ?? [];

  const rewardsEarned = rewards.reduce((acc, reward) => {
    const claimed = reward.responses.filter(response => response.reward_claimed).length;
    return acc + claimed;
  }, 0);

  return (
    <HydrateClient>
      <Container>
        {/* Overview Section */}
        <section>
          <div className='mb-6 flex flex-row items-center justify-between md:space-y-0'>
            <h2 className='text-2xl'>Rewards</h2>
            <CreateRewardDialog />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Total Rewards</span>
                <span className='text-3xl font-medium'>{rewards.length}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Rewards Earned</span>
                <span className='text-3xl font-medium'>{rewardsEarned}</span>
              </CardContent>
            </Card>
          </div>
        </section>
        <Card className='mt-5 flex flex-col px-4 py-6'>
          <h2 className='mb-4 text-2xl md:mb-8'>Recent Rewards</h2>
          <div className='w-full overflow-x-auto'>
            <RewardTable columns={columns} data={data} />
          </div>
        </Card>
      </Container>
    </HydrateClient>
  );
}
