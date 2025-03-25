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
      <main className='flex h-full min-h-screen w-full grow flex-col items-center overflow-y-auto p-4 sm:h-screen 2xl:p-12'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
