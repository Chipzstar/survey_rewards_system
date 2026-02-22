import { Submission } from '~/app/api/webhook/fillout/types';
import { promises as fs } from 'node:fs';
import { env } from '~/env';

const { NODE_ENV, FILLOUT_WEBHOOK_SECRET: secret } = env;

export const getUserDetails = (form: Submission) => {
  let email, name;
  email = form.questions.find(q => q.id === '75vZ')?.value;
  if (!email) email = '';
  name = form.questions.find(q => q.id === 'dpQC')?.value;
  if (!name) name = '';
  return { email: String(email), name: String(name) };
};

export async function writeToFile(data: any) {
  const submissionId = data.submission.submissionId as string;
  const filePath = `${process.cwd()}/fillout/submissions/${submissionId}.json`;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Verifies a webhook signature from Fillout.com against a base64 encoded secret
 *
 * @param sig - The signature received from the Fillout webhook request headers
 * @returns boolean - True if the signature matches the decoded secret, false otherwise
 *
 * @example
 * // Webhook handler
 * const signature = req.headers['fillout-signature'];
 * if (!verifySignature(signature)) {
 *   return new Response('Invalid signature', { status: 401 });
 * }
 *
 * @remarks
 * - The secret should be base64 encoded and stored in environment variables
 * - This verification ensures webhooks are genuinely from Fillout.com
 * - For development, you may want to bypass verification by uncommenting the development check
 */
export const verifySignature = (sig: string | null) => {
  if (NODE_ENV === 'development') return true;
  const base64Secret = atob(secret).trim();
  console.log({ base64Secret, sig, secret });
  return base64Secret === sig;
};
