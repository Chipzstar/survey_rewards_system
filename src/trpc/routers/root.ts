import { baseProcedure, createTRPCRouter } from '../init';
import { eventRouter } from './event';
import { surveyRouter } from './survey';
import { winnerRouter } from './winner';
import { responseRouter } from './response';
import { referralRouter } from './referral';
// export type definition of API
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs/server';

export const appRouter = createTRPCRouter({
  event: eventRouter,
  survey: surveyRouter,
  winner: winnerRouter,
  referral: referralRouter,
  response: responseRouter
});

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f(['image/jpeg', 'image/png'])
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  pdfUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '16MB',
      maxFileCount: 1
    }
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;

export type AppRouter = typeof appRouter;
