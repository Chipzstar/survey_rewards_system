import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EventDashboard({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className='flex min-h-screen flex-col items-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='mb-4 flex w-full items-center justify-between md:mb-8'>
        <h1 className='text-3xl font-bold md:text-4xl'>The Tech Conference 2024</h1>
        <Link href='/dashboard' className='text-white underline'>
          Home
        </Link>
      </div>
      <div className='flex flex-col items-center'>
        <div className='mb-4 md:mb-8'>
          <Button asChild>
            <Link href={`/src/app/(app)/event/${id}/share`}>QR code & link</Link>
          </Button>
        </div>
        <div className='flex flex-col items-start'>
          <h2 className='mb-2 text-2xl font-bold md:mb-4'>The Big Picture</h2>
          <div className='mb-2 flex gap-4 md:mb-4 md:gap-8'>
            <div className='flex flex-col items-center'>
              <h3 className='text-xl font-semibold'>Completed surveys</h3>
              <p className='text-2xl font-bold md:text-3xl'>40</p>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='text-xl font-semibold'># of referrals</h3>
              <p className='text-2xl font-bold md:text-3xl'>100</p>
            </div>
          </div>
          <div className='mb-2 flex flex-col gap-1 md:mb-4 md:gap-2'>
            <p>
              No. of surveys started: <span className='font-bold'>40</span>
            </p>
            <p>
              No. of surveys completed: <span className='font-bold'>35</span>
            </p>
            <p>
              Survey completion rate: <span className='font-bold'>87.5%</span>
            </p>
            <p>
              Average time taken: <span className='font-bold'>5min</span>
            </p>
            <p>
              Total no. of referrals: <span className='font-bold'>100</span>
            </p>
            <p>
              Av. number of referrals: <span className='font-bold'>5</span>
            </p>
          </div>
          <h2 className='mb-2 text-2xl font-bold md:mb-4'>Giftcard Leaderboard</h2>
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead>
                <tr>
                  <th className='px-2 py-1 md:px-4 md:py-2'></th>
                  <th className='px-2 py-1 md:px-4 md:py-2'>Time(m)</th>
                  <th className='px-2 py-1 md:px-4 md:py-2'>Ref</th>
                  <th className='px-2 py-1 md:px-4 md:py-2'>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>1. Chioma Abazie</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2:10</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>5</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>590</td>
                </tr>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2. Shake Belton</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2:14</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>470</td>
                </tr>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3. Berry Coolio</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2:16</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>450</td>
                </tr>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>4. Julie Ashray</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>2:18</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>1</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>430</td>
                </tr>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>5. Mary Look</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3:00</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>425</td>
                </tr>
                <tr>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>6. Daniel Asher</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3:15</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>3</td>
                  <td className='border px-2 py-1 md:px-4 md:py-2'>400</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
