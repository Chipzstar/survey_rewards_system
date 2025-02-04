import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';

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
