import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunk<T>(array: T[], numChunks: number): T[][] {
  if (numChunks <= 0) {
    throw new Error('Number of chunks must be greater than 0');
  }

  if (array.length === 0) {
    return Array(numChunks).fill([]);
  }

  const baseChunkSize = Math.floor(array.length / numChunks);
  const remainder = array.length % numChunks;
  const result: T[][] = [];
  let currentIndex = 0;

  for (let i = 0; i < numChunks; i++) {
    const currentChunkSize = i < remainder ? baseChunkSize + 1 : baseChunkSize;
    result.push(array.slice(currentIndex, currentIndex + currentChunkSize));
    currentIndex += currentChunkSize;
  }

  return result;
}

export function generateId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}
