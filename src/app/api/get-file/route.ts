import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({
  // ...options,
});

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
