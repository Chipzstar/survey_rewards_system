import { env } from '@/env';
import { PostHog } from 'posthog-node';

const { POSTHOG_API_TOKEN } = env;

export const posthog = new PostHog(
  POSTHOG_API_TOKEN,
  {
    host: 'https://eu.i.posthog.com',
    disabled: process.env.NODE_ENV !== 'production'
  } // You can omit this line if using PostHog Cloud
);

await posthog.shutdown(); // TIP: On program exit, call shutdown to stop pending pollers and flush any remaining events
