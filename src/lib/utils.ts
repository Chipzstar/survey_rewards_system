import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
