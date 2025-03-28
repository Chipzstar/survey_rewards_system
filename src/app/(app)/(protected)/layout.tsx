// src/app/(app)/survey/layout.tsx
import { PropsWithChildren } from 'react';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/layout/app-sidebar';
import { DashboardHeader } from '~/components/layout/nav-header';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface Props extends PropsWithChildren {
  params: {
    id: string;
  };
}

export default async function SurveyLayout({ children, params }: Props) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const user = await currentUser();
  if (!user) redirect('/login');
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='flex h-full min-h-screen w-full grow flex-col overflow-y-auto p-4 sm:h-screen'>
        <div className='w-full border-b border-border bg-background/60 backdrop-blur-sm dark:bg-transparent sm:px-4 md:px-6 lg:px-8'>
          <DashboardHeader userId={user.id} firstname={user.firstName} />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
