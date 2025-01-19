import { buffer } from 'micro';
import { FormEvent } from './types';
import { prettyPrint } from '~/lib/utils';
import { NextRequest } from 'next/server';

/**
 * Simple API route which logs the incoming request to the console and returns a JSON response
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {
  prettyPrint(req);
  const payload = (await buffer(req)).toString();
  const event = JSON.parse(payload) as FormEvent;
  return new Response(JSON.stringify({ message: 'Hello, Fillout!' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
