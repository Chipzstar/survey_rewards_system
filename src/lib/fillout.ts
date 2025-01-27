import { Submission } from '~/app/api/webhook/fillout/types';
import { promises as fs } from 'node:fs';
import { env } from '~/env';

const { NODE_ENV, FILLOUT_FORM_ID, FILLOUT_WEBHOOK_SECRET: secret } = env;

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

export const verifySignature = (sig: string | null) => {
  if (NODE_ENV === 'development') return true;
  const base64Secret = btoa(secret);
  return base64Secret === sig;
};
