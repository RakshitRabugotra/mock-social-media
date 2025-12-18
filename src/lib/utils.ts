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
