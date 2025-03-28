'use client';

import Link from 'next/link';
import { Gift, Home, LogOut, MessageSquareMore } from 'lucide-react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const { signOut } = useAuth();
  const pathname = usePathname();
  return (
    <Sidebar className='py-6'>
      <SidebarHeader>
        <div className='flex items-center gap-3 px-4 pb-6'>
          <Image src='/logo.png' alt='Genus Logo' width={40} height={40} className='rounded-lg' />
          <div className='flex flex-col'>
            <span className='text-xl font-semibold'>Genus</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-6'>
        <SidebarMenu className='gap-y-4'>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip='Dashboard' asChild isActive={pathname === '/'}>
              <Link href='/'>
                <Home className='h-4 w-4' />
                <span className='text-base'>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href='/rewards' passHref legacyBehavior>
              <SidebarMenuButton tooltip='Rewards'>
                <Gift className='h-4 w-4' />
                <span className='text-base'>Rewards</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className='mb-2 mt-6 px-3'>
          <span className='text-xs font-medium text-gray-500'>Support</span>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <Link href='/support' passHref legacyBehavior>
              <SidebarMenuButton tooltip='Chat Support'>
                <MessageSquareMore className='h-4 w-4' />
                <span className='text-base'>Chat Support</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='px-6'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip='Logout' onClick={() => signOut()}>
              <LogOut className='h-4 w-4' />
              <span className='text-base'>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
