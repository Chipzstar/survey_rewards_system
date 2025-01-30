import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '~/components/theme-provider';
import { ThemeToggle } from '~/components/ui/theme';
import { TRPCProvider } from '~/trpc/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Survey Rewards System',
  description: 'A survey reward system for event organizers.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <TRPCProvider>
        <html lang='en'>
          <body className={inter.className}>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              {children}
              <div className='fixed bottom-4 left-4 z-50 hidden md:block'>
                <ThemeToggle />
              </div>
            </ThemeProvider>
          </body>
        </html>
      </TRPCProvider>
    </ClerkProvider>
  );
}
