import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '~/components/providers/theme-provider';
import { ThemeToggle } from '~/components/ui/theme';
import { TRPCProvider } from '~/trpc/client';
import { LoadingProvider } from '~/components/providers/loading-provider';
import { Toaster } from 'sonner';
import { extractRouterConfig } from 'uploadthing/server';
import { uploadFileRouter } from '~/trpc/routers/root';

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
            <LoadingProvider>
              <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false} disableTransitionOnChange>
                <NextSSRPlugin
                  /**
                   * The `extractRouterConfig` will extract **only** the route configs
                   * from the router to prevent additional information from being
                   * leaked to the client. The data passed to the client is the same
                   * as if you were to fetch `/api/uploadthing` directly.
                   */
                  routerConfig={extractRouterConfig(uploadFileRouter)}
                />
                {children}
                <div className='fixed bottom-4 left-4 z-50 hidden md:block'>
                  <ThemeToggle />
                </div>
                <Toaster richColors />
              </ThemeProvider>
            </LoadingProvider>
          </body>
        </html>
      </TRPCProvider>
    </ClerkProvider>
  );
}
