import type { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

import { env } from '~/env';
import { createNewUser, deleteUser, updateUser } from './_handlers';
import { NextResponse } from 'next/server';

const { CLERK_WEBHOOK_SECRET: webhookSecret } = env;

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint

  if (!webhookSecret) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const body = JSON.stringify(await req.json());

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  let data;
  // Handle the webhook
  switch (eventType) {
    case 'user.created':
      data = await createNewUser(evt);
      break;
    case 'user.updated':
      data = await updateUser(evt);
      break;
    case 'user.deleted':
      data = await deleteUser(evt);
      break;
    default:
      console.log(`Unhandled event type ${eventType}`);
  }

  return NextResponse.json({
    received: true,
    message: `Webhook received!`,
    data: data ?? undefined
  });
}
