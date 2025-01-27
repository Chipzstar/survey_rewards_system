import { env } from '~/env';
import { FormEvent } from './types';
import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import { getUserDetails } from '~/lib/fillout';
import { db } from '~/db';
import { surveyResponseTable, usersTable } from '~/db/schema';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

const { NODE_ENV, FILLOUT_FORM_ID, FILLOUT_WEBHOOK_SECRET: secret } = env;

async function writeToFile(data: any) {
  const submissionId = data.submission.submissionId as string;
  const filePath = `${process.cwd()}/fillout/submissions/${submissionId}.json`;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const verifySignature = (sig: string | null) => {
  if (NODE_ENV === 'development') return true;
  const base64Secret = btoa(secret);
  return base64Secret === sig;
};

async function handleFormResponse(event: FormEvent) {
  if (NODE_ENV === 'development') await writeToFile(event);
  const { email, name } = getUserDetails(event.submission);
  if (!email || !name) return event;
  // split name into first and last name
  const [firstname, lastname] = name.split(' ');
  const clerk_id = `guest_${nanoid(26)}`;
  const user = await db
    .insert(usersTable)
    .values({
      clerk_id,
      firstname: firstname,
      lastname: lastname,
      email,
      username: name
    })
    .returning();

  if (!user[0]) return event;
  // started_at = (submission time - 5 minutes)
  const completed_at = new Date(event.submission.submissionTime);
  const started_at = new Date(completed_at.getTime() - 5 * 60 * 1000).toISOString();

  // create survey response record
  const surveyResponse = await db
    .insert(surveyResponseTable)
    .values({
      user_id: user[0].id,
      response_id: event.submission.submissionId,
      survey_code: event.formId,
      passcode: nanoid(6),
      started_at,
      completed_at: completed_at.toISOString(),
      survey_id
    })
    .returning();
  console.log('user', user);
  return event;
}

export async function POST(req: Request) {
  try {
    const event = (await req.json()) as FormEvent;
    const signature = req.headers.get('fillout-signature');
    const isValid = verifySignature(signature);
    if (!isValid) {
      return NextResponse.json(
        { received: true, message: `Webhook received`, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    let data;
    console.log(event);
    switch (event.formId) {
      case FILLOUT_FORM_ID:
        data = await handleFormResponse(event);
        break;
      default:
        break;
    }

    console.log(data);
    return NextResponse.json({ received: true, message: `Webhook received`, data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ received: true, message: `Webhook received`, error: err.message }, { status: 500 });
  }
}
