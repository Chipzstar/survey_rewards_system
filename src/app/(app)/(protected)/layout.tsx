// src/app/(app)/survey/layout.tsx
import { FC, PropsWithChildren } from 'react';
import { MainNav } from '~/components/layout/main-nav';
import { trpc } from '~/trpc/server';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/layout/app-sidebar';

interface Props extends PropsWithChildren {
  params: {
    id: string;
  };
}

export default async function SurveyLayout({ children, params }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex h-full min-h-screen w-full grow flex-col overflow-y-auto p-4 sm:h-screen'>
        <div className='dark:border-border-dark absolute left-0 right-0 top-0 z-10 h-16 w-full border-b border-border bg-background/60 backdrop-blur-sm dark:bg-background/80 sm:px-4 md:px-6 lg:px-8'>
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
