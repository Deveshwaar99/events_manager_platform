import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(error: unknown) {
  console.log(error)
  if (typeof error === 'string') {
    throw new Error(error)
  } else {
    throw new Error(JSON.stringify(error))
  }
}
export const convertFileToUrl = (file: File) => URL.createObjectURL(file)
