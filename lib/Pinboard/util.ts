import {stringify} from 'querystring';

/* Return a query string with leading question mark,
 * unless the query parameter is empty, in which case return an empty string
 */
export const optionalQueryStringWithQmark = (
  query: object | undefined,
): string => {
  if (typeof query === 'undefined') {
    return '';
  }
  const queryString = stringify(Object.assign({}, query));
  return queryString ? `?${queryString}` : '';
};

/* Return a number of seconds to wait before trying again
 *
 * ordinalAttempt:  The ordinal number of the attempt, e.g. 1 for the first, 2 for the second, etc
 * rateLimit:       The number of seconds between allowed calls (assuming no errors)
 * maxValue:        The max number of seconds to wait
 *
 * Pinboard API docs say:
 * "Make sure your API clients check for 429 Too Many Requests server errors and back off appropriately. If possible, keep doubling the interval between requests until you stop receiving errors."
 * This function calculates how long we should wait in the spirit of that requirement.
 */
function doublePerAttemptUpToMax(
  ordinalAttempt: number,
  rateLimit: number,
  maxValue: number,
) {
  const attemptIndex = ordinalAttempt - 1;
  return Math.min(maxValue, rateLimit * 2 ** attemptIndex);
}

/* Return React Query rate limit parameters for endpoints
 *
 * cacheTime: How long the data is cached, even if the query is inactive because it has no mounted subscribers.
 * staleTime: How long data is considered fresh. No requests will be made as long as data is fresh, and still cached.
 * retry: Retry failed queries indefinitely
 * retryDelay: Double the backoff rate up to some maximum when retries fail
 */
export function rqRateLimitParams(endpointName: string) {
  let cacheSecs = 3; // Length of time result stays in memory.
  let staleSecs = 3; // Length of time before an in-memory result will be refetched.
  let maxWaitSecs = 60;
  switch (endpointName) {
    case 'postsAll':
      cacheSecs = 5 * 60;
      staleSecs = 60 * 60;
      maxWaitSecs = 60 * 60;
      break;
    case 'postsRecent':
      cacheSecs = 60;
      staleSecs = 20 * 60;
      maxWaitSecs = 20 * 60;
      break;
  }
  return {
    cacheTime: cacheSecs * 1000, // RQ's cacheTime is in ms
    staleTime: staleSecs * 1000, // RQ's staleTime is in ms
    retry: true,
    retryDelay: (retry: number) =>
      doublePerAttemptUpToMax(retry, cacheSecs, maxWaitSecs),
  };
}
