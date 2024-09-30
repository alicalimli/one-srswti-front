import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainFromLink(link: string): string {
  try {
    const url = new URL(link);
    return url.hostname;
  } catch (error) {
    console.error("Invalid URL:", link);
    return "";
  }
}

export function truncateStringWithEllipsis(
  str: string,
  maxLength: number
): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}
