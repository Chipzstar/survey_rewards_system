import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prettyPrint(obj: any, char = '-') {
  console.log(char.repeat(40));
  console.log(obj);
  console.log(char.repeat(40));
}
