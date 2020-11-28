import Queue from 'smart-request-balancer';

import {fetchOrFake} from 'lib/FetchOrFake';
import {useState} from 'react';

/* Break out the queue configuration so we can reference it later
 */
const queueConfig = {
  rules: {
    // Default queue: one request every 3 seconds
    common: {
      rate: 1,
      limit: 3,
      priority: 1,
    },
    // API's posts/recent call is more stringent: one request every minute
    apiPostsRecent: {
      rate: 1,
      limit: 60,
      priority: 1,
    },
    // API's posts/all call is still more stringent: one post every 5 minutes
    apiPostsAll: {
      rate: 1,
      limit: 300,
      priority: 1,
    },
  },
  retryTime: 9,
};

/* The queue key is always the same.
 * smart-request-balancer was designed to have keyed queues,
 * where you can e.g. send X messages per second per user.
 * In this example, you might use the username as the key.
 * The Pinboard API doesn't have keyed queues, so we use a constant for the key.
 */
const queueKey = 'PinboardQueueKey';

/* A QueueName must be the name of an existing queue, defined in the queueConfig object
 */
export type QueueName = keyof typeof queueConfig.rules;

/* A retry function tries a request again after a variable delay
 */
type RetryFunction = (delaySecs?: number) => void;

/* Wrap a queue around FetchOrFake.fetchOrFake()
 *
 * Arguments:
 *   queue: A Queue object
 *   queueName: The name of a queue defined in the Queue
 *   production: If true, fetch(); otherwise, return fake data
 *   fauxData: Fake data to return if production is false
 *   uri: The URI to call if production is true
 *   headers: HTTP headers to use if production is true
 */
function queuedFetchOrFake(
  queue: Queue,
  queueName: QueueName,
  production: boolean,
  fauxData: object,
  uri: string,
  headers?: {[key: string]: string},
): Promise<any> {
  /* If we pass faux data to fetchOrFake(), it'll return that data to us;
   * only pass it when not in production mode
   */
  const passingFauxData = production ? undefined : fauxData;

  /* The request function tries to get data, and must handle retries
   */
  const requestor = (retryFn: RetryFunction) =>
    fetchOrFake(uri, headers, passingFauxData)
      .then((result) => {
        console.log(
          `fetchOrReturnFaux(): retryFn(): raw result: ${JSON.stringify(
            result,
          )}`,
        );
        return result;
      })
      .catch((error) => {
        if (error.response.status === 429) {
          return retryFn(error.response.data.parameters.retry_after * 2);
        }
      });

  return queue
    .request(requestor, queueKey, queueName)
    .then((response) => {
      console.log(
        `queuedFetchOrReturnFaux(): Returning response: ${JSON.stringify(
          response,
        )}`,
      );
      return response;
    })
    .catch((error) => {
      console.error(`queuedFetchOrReturnFaux(): error: ${error}`);
      throw error;
    });
}

export default function usePinboardQueue(queueConfig) {
  /* A smart-request-balancer queue.
   * We use this to conform with the Pinboard API's rate limits
   */
  const [queue, setQueue] = useState(new Queue(queueConfig));

  return {queue, setQueue, queuedFetchOrFake};
}
