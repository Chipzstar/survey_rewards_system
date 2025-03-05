import { utapi } from '~/trpc/routers/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const key = 'XLNdKOzlMKEivyb6nSgKQChlUSfBFw9oyenxHb3TuzWLktEO';
  const file = await utapi.getSignedURL(key, {
    // Expires in 7 days
    expiresIn: 60 * 60 * 24 * 7
  });
  console.log(file);
  return new Response(JSON.stringify(file), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
