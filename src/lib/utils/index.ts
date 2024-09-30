import { CoreMessage } from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

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

/**
 * Takes an array of AIMessage and modifies each message where the role is 'tool'.
 * Changes the role to 'assistant' and converts the content to a JSON string.
 * Returns the modified messages as an array of CoreMessage.
 *
 * @param aiMessages - Array of AIMessage
 * @returns modifiedMessages - Array of modified messages
 */
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages
    .filter(
      (message) =>
        !(message.role === "user" && message.content === '{"action": "skip"}')
    )
    .map((message) =>
      message.role === "tool"
        ? {
            ...message,
            role: "assistant",
            content: JSON.stringify(message.content),
            type: "tool",
          }
        : message
    ) as CoreMessage[];
}

export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, "%20");
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
