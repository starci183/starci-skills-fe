import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges conditional utility classes while preserving Tailwind precedence. */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
