import { env } from '~/env';
import { FormEvent } from './types';
import { NextResponse } from 'next/server';
import { getUserDetails, verifySignature, writeToFile } from '~/lib/fillout';
import { db } from '~/db';
import { surveyResponseTable, surveyTable, usersTable } from '~/db/schema';
import { customAlphabet } from 'nanoid';
import { prettyPrint } from '~/lib/utils';
import { eq } from 'drizzle-orm';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

const { NODE_ENV, FILLOUT_FORM_ID } = env;

async function handleFormResponse(event: FormEvent) {
  if (NODE_ENV === 'development') await writeToFile(event);
  const start_timestamp = event.submission.urlParameters.find(param => param.name === 'start_time')?.value;
  const survey_id = Number(event.submission.urlParameters.find(param => param.name === 'id')?.value);

  const { email, name } = getUserDetails(event.submission);
  if (!email || !name) return null;
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

  // fetch the survey using the survey_id
  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, survey_id));
  if (!survey[0] || !user[0]) return null;
  const completed_at = new Date(event.submission.submissionTime).toISOString();
  const started_at = new Date(Number(start_timestamp)).toISOString();

  console.table({ completed_at, started_at });

  // create survey response record
  const surveyResponse = await db
    .insert(surveyResponseTable)
    .values({
      user_id: user[0].id,
      survey_id,
      response_id: event.submission.submissionId,
      survey_code: event.formId,
      passcode: nanoid(6),
      started_at,
      completed_at,
      points_earned: survey[0].points,
      is_completed: true
    })
    .returning();

  if (!surveyResponse[0]) return null;
  return surveyResponse[0];
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
    switch (event.formId) {
      case FILLOUT_FORM_ID:
        data = await handleFormResponse(event);
        break;
      default:
        break;
    }

    prettyPrint(data);
    return NextResponse.json({ received: true, message: `Webhook received`, data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ received: true, message: `Webhook received`, error: err.message }, { status: 500 });
  }
}
