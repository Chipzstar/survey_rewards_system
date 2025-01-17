import type { DeletedObjectJSON, UserJSON, UserWebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import shortHash from 'shorthash2';

import { posthog } from '@/lib/posthog';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { usersTable } from '@/db/schema';

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
      clerkId: String(payload.id),
      email: String(payload.email_addresses[0]?.email_address),
      firstname: payload.first_name,
      lastname: payload.last_name,
      tempPassword: payload.unsafe_metadata.tempPassword as string,
      isActive: true
    });

    const dbUser = (await db.select().from(usersTable).where(eq(usersTable.clerkId, payload.id)))[0];

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
    let dbUser = (await db.select().from(user).where(eq(user.clerkId, payload.id)))[0];

    if (!dbUser) throw new Error('Could not find user');

    // check if the user has an "imageUrl" field. If they do continue
    const newImage = !dbUser.imageUrl && payload.has_image;
    // check if the new image is different from the last one they uploaded
    const changedImage = !!dbUser.imageUrl && dbUser.clerkImageHash !== shortHash(payload.image_url);

    console.table({
      dbImageUrl: dbUser.imageUrl,
      payloadImageUrl: payload.image_url,
      currHash: dbUser.clerkImageHash,
      newHash: shortHash(payload.image_url)
    });

    if (newImage || changedImage) {
      const fileUrl = payload.image_url;
      uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
    }

    // if a new image was uploaded, delete the old one
    if (uploadedFile?.data) {
      if (dbUser.imageKey) await utapi.deleteFiles([dbUser.imageKey]);
      // update the imageHash within the clerk account
      const clerkUser = await clerkClient.users.updateUser(payload.id, {
        privateMetadata: {
          ...payload.private_metadata,
          image_hash: shortHash(payload.image_url),
          ut_key: uploadedFile.data.key,
          ut_url: uploadedFile.data.url
        }
      });
      posthog.capture({
        distinctId: dbUser.email,
        event: 'User Image Updated',
        properties: {
          userId: String(clerkUser.id),
          imageKey: uploadedFile.data.key,
          imageUrl: uploadedFile.data.url
        }
      });
    }

    const shouldUpdate = Boolean(
      uploadedFile ??
        dbUser.email !== payload.email_addresses[0]?.email_address ??
        dbUser.firstname !== payload.first_name ??
        dbUser.lastname !== payload.last_name
    );

    console.table({ shouldUpdate });

    // update the user in the db
    if (shouldUpdate)
      dbUser = (
        await db
          .update(usersTable)
          .set({
            firstname: payload.first_name,
            lastname: payload.last_name,
            ...(uploadedFile?.data && { imageKey: uploadedFile.data.key }),
            ...(uploadedFile?.data && { imageUrl: uploadedFile.data.url }),
            ...(uploadedFile?.data && {
              clerkImageHash: shortHash(payload.image_url)
            })
          })
          .where(eq(usersTable.clerkId, payload.id))
          .returning()
      )[0];
    posthog.capture({
      distinctId: dbUser.email,
      event: 'User Updated',
      properties: {
        ...dbUser
      }
    });
    return dbUser;
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
