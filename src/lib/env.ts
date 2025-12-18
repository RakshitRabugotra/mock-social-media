/**
 * Exports all the environment variables
 */

export const getBaseUrl = () => {
  // Let's fallback to the next-public app-url
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // We're running locally, so we should use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

/**
 * Base API URL
 */
export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};
