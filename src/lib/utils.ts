import { Document, Reference } from "@/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

/**
 * A utility function to safely extract a field from a reference which can be either an ID or a populated object.
 * @param reference The reference field which can be either an ID or a populated object
 * @param extractor The function to extract the desired field from the populated object
 * @param fallback The fallback value to return if the reference is not populated
 * @returns The extracted value or the fallback
 */
export const getReferenceField = <T, D = string>(
  reference: Reference<T> | null,
  extractor: (data: Document & T) => D,
  fallback: D = "" as D
) => {
  if (!reference) return fallback;
  return typeof reference === "object" ? extractor(reference) : fallback;
};

/**
 * A utility function to get the time ago string like "1 year ago", "2 months ago", "3 days ago", "4 hours ago", "5 minutes ago", "6 seconds ago"
 * @param isoDate The iso date timestamp
 * @returns The time ago string liek ""
 */
export function timeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const value = Math.floor(seconds / interval.seconds);
    if (Math.abs(value) >= 1) {
      return rtf.format(-value, interval.unit);
    }
  }

  return "just now";
}
