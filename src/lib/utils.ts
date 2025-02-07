import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';
import { surveyResponseTable } from '~/db/schema';
import { differenceInSeconds } from 'date-fns';

type SurveyResponse = typeof surveyResponseTable.$inferSelect;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prettyPrint = (val: any, character: string = '-', newLine: boolean = false) => {
  const border = character.repeat(55);
  if (newLine) console.log('');
  console.log(border);
  console.log(val);
  console.log(`${border}\n`);
};

export const genUserId = customAlphabet('1234567890', 4);

export const genPasscode = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export function rankResponses(responses: SurveyResponse[]) {
  return (a: SurveyResponse, b: SurveyResponse) => {
    // Calculate completion times in seconds
    const timeA = differenceInSeconds(new Date(a.completed_at), new Date(a.started_at));
    const timeB = differenceInSeconds(new Date(b.completed_at), new Date(b.started_at));

    // Get points
    const pointsA = a.points_earned;
    const pointsB = b.points_earned;

    // Normalize the metrics to a 0-1 scale
    const maxTime = Math.max(
      ...responses.map(r => differenceInSeconds(new Date(r.completed_at), new Date(r.started_at)))
    );
    const maxPoints = Math.max(...responses.map(r => r.points_earned));

    // Convert to normalized scores (0-1 range)
    const timeScoreA = 1 - timeA / maxTime; // Invert so faster times get higher scores
    const timeScoreB = 1 - timeB / maxTime;
    const pointsScoreA = pointsA / maxPoints;
    const pointsScoreB = pointsB / maxPoints;

    // Calculate final scores (equal weight to both factors)
    const finalScoreA = (timeScoreA + pointsScoreA) / 2;
    const finalScoreB = (timeScoreB + pointsScoreB) / 2;

    // Sort descending (highest to lowest score)
    return finalScoreB - finalScoreA;
  };
}

export function sortResponsesByCompletionTime(responses: SurveyResponse[]): SurveyResponse[] {
  return responses.sort((a, b) => {
    const timeA = differenceInSeconds(new Date(a.completed_at), new Date(a.started_at));
    const timeB = differenceInSeconds(new Date(b.completed_at), new Date(b.started_at));
    return timeA - timeB;
  });
}
