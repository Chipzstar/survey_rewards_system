import type { DeletedObjectJSON, UserJSON, UserWebhookEvent } from '@clerk/nextjs/server';

import { posthog } from '~/lib/posthog';
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { usersTable } from '~/db/schema';

// const utapi = new UTApi();

export const createNewUser = async (event: UserWebhookEvent) => {
  try {
    const payload = event.data as UserJSON;
    posthog.identify({
      distinctId: String(payload.id),
      properties: {
        email: payload.email_addresses[0]?.email_address,
        firstname: payload.first_name,
        lastname: payload.last_name
      }
    });
    // const waitingListEnabled = await posthog.isFeatureEnabled("waiting-list", String(payload.id));
    // log.info("Feature flag", { waitingListEnabled });
    // create the user
    await db.insert(usersTable).values({
      clerk_id: String(payload.id),
      email: String(payload.email_addresses[0]?.email_address),
      username: payload.username,
      firstname: payload.first_name,
      lastname: payload.last_name
    });

    const dbUser = (await db.select().from(usersTable).where(eq(usersTable.clerk_id, payload.id)))[0];

    if (!dbUser) throw new Error('Could not create user');

    console.log(payload.unsafe_metadata);

    return {
      dbUser
    };
  } catch (err: any) {
    console.error(err);
    // log.error(err.message, err);
    throw err;
  }
};

export const updateUser = async (event: UserWebhookEvent) => {
  try {
    let uploadedFile;
    const payload = event.data as UserJSON;
    // check if the user already exists in the db
    let dbUser = (await db.select().from(usersTable).where(eq(usersTable.clerk_id, payload.id)))[0];

    if (!dbUser) throw new Error('Could not find user');

    // update the user in the db
    dbUser = (
      await db
        .update(usersTable)
        .set({
          firstname: String(payload.first_name),
          lastname: String(payload.last_name)
        })
        .where(eq(usersTable.clerk_id, payload.id))
        .returning()
    )[0];

    if (dbUser) {
      posthog.capture({
        distinctId: dbUser.email,
        event: 'User Updated',
        properties: {
          ...dbUser
        }
      });
      return dbUser;
    }
    return {};
  } catch (err: any) {
    console.error(err);
    // log.error(err.message, err);
    throw err;
  }
};

export const deleteUser = async (event: UserWebhookEvent) => {
  try {
    const payload = event.data as DeletedObjectJSON;
    // check if the user exists in the db
    const dbUser = (await db.select().from(usersTable).where(eq(usersTable.clerkId, payload.id!)))[0];
    if (!dbUser) throw new Error('Could not find user');
    // delete any entities in the DB that link directly to the user
    // delete the user in db
    await db.delete(usersTable).where(eq(usersTable.clerkId, payload.id!));
    posthog.capture({
      distinctId: dbUser.email,
      event: 'User Deleted',
      properties: dbUser
    });
    return dbUser;
  } catch (err: any) {
    console.error(err);
    return err?.meta ? err.meta.cause : err.message;
  }
};
